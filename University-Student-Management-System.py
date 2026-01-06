import tkinter as tk
from tkinter import ttk, messagebox
import sqlite3

class UniversityManagementSystem:
    def __init__(self, root):
        self.root = root
        self.root.title("University Student Information System (USIS)")
        self.root.geometry("1200x800")
        
        # Professional Color Palette
        self.primary_color = "#002147"   # Oxford Blue
        self.accent_color = "#D4AF37"    # Metallic Gold
        self.bg_light = "#F4F7F6"        # Soft Gray-White
        self.text_light = "#FFFFFF"
        
        self.root.configure(bg=self.bg_light)
        self.create_db()

        # Responsive weights
        self.root.columnconfigure(1, weight=1)
        self.root.rowconfigure(1, weight=1)

        # --- 1. HEADER ---
        header = tk.Frame(self.root, bg=self.primary_color, height=120, bd=0)
        header.grid(row=0, column=0, columnspan=2, sticky="nsew")
        header.pack_propagate(False)

        # Title (Strictly Text)
        title_label = tk.Label(header, text="UNIVERSITY STUDENT MANAGEMENT SYSTEM", 
                               font=("Times New Roman", 28, "bold"), 
                               bg=self.primary_color, fg=self.text_light)
        title_label.pack(pady=(20, 0))

        subtitle_label = tk.Label(header, text="Department of Academic Affairs | Session 2024-2026", 
                                  font=("Arial", 11, "italic"), 
                                  bg=self.primary_color, fg=self.accent_color)
        subtitle_label.pack()
        
        gold_line = tk.Frame(header, bg=self.accent_color, height=4)
        gold_line.pack(side=tk.BOTTOM, fill=tk.X)

        # --- 2. SIDEBAR ---
        self.side_panel = tk.Frame(self.root, bg="white", width=380, padx=25, relief=tk.RIDGE, bd=1)
        self.side_panel.grid(row=1, column=0, sticky="nsew", padx=10, pady=10)
        
        tk.Label(self.side_panel, text="Student Registration", font=("Arial", 16, "bold"), 
                 bg="white", fg=self.primary_color).pack(pady=20)

        # Input Variables
        self.roll_var = tk.StringVar()
        self.name_var = tk.StringVar()
        self.sem_var = tk.StringVar()
        self.obt_marks_var = tk.StringVar()
        self.total_marks_var = tk.StringVar()

        self.create_input("Student Roll No.", self.roll_var)
        self.create_input("Full Name", self.name_var)
        self.create_input("Current Semester", self.sem_var)
        self.create_input("Marks Obtained", self.obt_marks_var)
        self.create_input("Maximum Marks", self.total_marks_var)

        # Action Buttons
        btn_frame = tk.Frame(self.side_panel, bg="white")
        btn_frame.pack(pady=30)
        
        style_btn = {"font": ("Arial", 10, "bold"), "fg": "white", "width": 12, "bd": 0, "cursor": "hand2"}
        
        tk.Button(btn_frame, text="SAVE", command=self.add_student, bg="#27ae60", **style_btn).grid(row=0, column=0, padx=5, pady=5)
        tk.Button(btn_frame, text="UPDATE", command=self.update_student, bg="#2980b9", **style_btn).grid(row=0, column=1, padx=5, pady=5)
        tk.Button(btn_frame, text="REMOVE", command=self.delete_student, bg="#c0392b", **style_btn).grid(row=1, column=0, padx=5, pady=5)
        tk.Button(btn_frame, text="RESET", command=self.clear_fields, bg="#7f8c8d", **style_btn).grid(row=1, column=1, padx=5, pady=5)

        # --- 3. MAIN DISPLAY ---
        self.main_panel = tk.Frame(self.root, bg=self.bg_light, padx=15, pady=10)
        self.main_panel.grid(row=1, column=1, sticky="nsew")
        self.main_panel.columnconfigure(0, weight=1)
        self.main_panel.rowconfigure(1, weight=1)

        search_frame = tk.Frame(self.main_panel, bg=self.bg_light)
        search_frame.grid(row=0, column=0, sticky="ew", pady=(0, 15))
        
        self.search_var = tk.StringVar()
        tk.Entry(search_frame, textvariable=self.search_var, font=("Arial", 14), width=30, bd=1).pack(side=tk.LEFT, padx=10, ipady=3)
        tk.Button(search_frame, text="Search Name", command=self.search_data, bg=self.primary_color, fg="white", padx=20).pack(side=tk.LEFT, padx=5)
        tk.Button(search_frame, text="Show All", command=self.fetch_all, bg="#95a5a6", fg="white", padx=15).pack(side=tk.LEFT)

        # Treeview (Table)
        table_style = ttk.Style()
        table_style.theme_use("clam")
        table_style.configure("Treeview", font=("Arial", 10), rowheight=35)
        table_style.configure("Treeview.Heading", font=("Arial", 11, "bold"), background=self.primary_color, foreground="white")

        cols = ("roll", "name", "sem", "obt", "total")
        self.student_table = ttk.Treeview(self.main_panel, columns=cols, show="headings")
        
        headers = {"roll": "Roll No", "name": "Student Name", "sem": "Semester", "obt": "Obtained", "total": "Total Max"}
        for col, text in headers.items():
            self.student_table.heading(col, text=text)
            self.student_table.column(col, anchor="center")

        self.student_table.grid(row=1, column=0, sticky="nsew")

        # Status Bar
        self.status_var = tk.StringVar(value="System Active")
        status_bar = tk.Label(self.root, textvariable=self.status_var, bg=self.primary_color, fg=self.accent_color, anchor="w", padx=10)
        status_bar.grid(row=2, column=0, columnspan=2, sticky="ew")

        self.fetch_all()

    def create_input(self, label_text, var):
        tk.Label(self.side_panel, text=label_text, bg="white", font=("Arial", 10, "bold")).pack(anchor="w", pady=(12, 0))
        tk.Entry(self.side_panel, textvariable=var, font=("Arial", 12), bg="#f9f9f9", bd=1).pack(fill="x", ipady=5)

    def create_db(self):
        with sqlite3.connect("uni_records.db") as conn:
            conn.execute("CREATE TABLE IF NOT EXISTS students (roll INTEGER PRIMARY KEY, name TEXT, semester TEXT, obt REAL, total REAL)")

    def add_student(self):
        try:
            with sqlite3.connect("uni_records.db") as conn:
                conn.execute("INSERT INTO students VALUES(?,?,?,?,?)", (self.roll_var.get(), self.name_var.get(), self.sem_var.get(), self.obt_marks_var.get(), self.total_marks_var.get()))
            self.fetch_all()
            messagebox.showinfo("Success", "Record Added")
            self.clear_fields()
        except Exception as e:
            messagebox.showerror("Error", f"Failed: {e}")

    def fetch_all(self):
        self.student_table.delete(*self.student_table.get_children())
        with sqlite3.connect("uni_records.db") as conn:
            rows = conn.execute("SELECT * FROM students").fetchall()
            for row in rows:
                self.student_table.insert('', tk.END, values=row)
        self.status_var.set(f"Records: {len(rows)}")

    def update_student(self):
        with sqlite3.connect("uni_records.db") as conn:
            conn.execute("UPDATE students SET name=?, semester=?, obt=?, total=? WHERE roll=?", 
                        (self.name_var.get(), self.sem_var.get(), self.obt_marks_var.get(), self.total_marks_var.get(), self.roll_var.get()))
        self.fetch_all()
        messagebox.showinfo("Update", "Success")

    def delete_student(self):
        if messagebox.askyesno("Confirm", "Delete record?"):
            with sqlite3.connect("uni_records.db") as conn:
                conn.execute("DELETE FROM students WHERE roll=?", (self.roll_var.get(),))
            self.fetch_all()
            self.clear_fields()

    def search_data(self):
        self.student_table.delete(*self.student_table.get_children())
        with sqlite3.connect("uni_records.db") as conn:
            rows = conn.execute("SELECT * FROM students WHERE name LIKE ?", ('%'+self.search_var.get()+'%',)).fetchall()
            for row in rows:
                self.student_table.insert('', tk.END, values=row)

    def clear_fields(self):
        for v in [self.roll_var, self.name_var, self.sem_var, self.obt_marks_var, self.total_marks_var]: v.set("")

if __name__ == "__main__":
    root = tk.Tk()
    app = UniversityManagementSystem(root)
    root.mainloop()