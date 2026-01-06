# Write a Python program to take a user’s name and age as input and print a message like: “Hello Ali, you are 20 years old.
name = input("Enter your name: ")
age = input("Enter your age: ")

print(f"Hello {name}, you are {age} years old.")

# Create a program that checks whether a given number is even or odd using an if-else statement.
num = int(input("Enter a number: "))

if num % 2 == 0:
    print(f"{num} is Even.")
else:
    print(f"{num} is Odd.")

# Write a Python program to find the largest number among three user-entered numbers.
a = float(input("Enter first number: "))
b = float(input("Enter second number: "))
c = float(input("Enter third number: "))

if a >= b and a >= c:
    largest = a
elif b >= a and b >= c:
    largest = b
else:
    largest = c

print(f"The largest number is {largest}")

# Create a list of 5 numbers and write a program to calculate and print their sum and average

numbers = [10, 25, 30, 45, 50]

total_sum = sum(numbers)
average = total_sum / len(numbers)

print(f"Sum: {total_sum}")
print(f"Average: {average}")

# Write a Python program to reverse a given string without using built-in reverse functions.

text = input("Enter a string: ")
# Syntax: [start:stop:step]
reversed_text = text[::-1]

print(f"Reversed string: {reversed_text}")

# Create a program that counts how many times a specific number appears in a list.

nums = [1, 4, 2, 4, 7, 4, 9, 10]
target = int(input("Enter number to count: "))
count = 0

for x in nums:
    if x == target:
        count += 1

print(f"The number {target} appears {count} times.")

# Write a Python program that prints numbers from 1 to 50, but skips numbers that are divisible by 5.
for i in range(1, 51):
    if i % 5 == 0:
        continue  # Skips the print statement if divisible by 5
    print(i, end=" ")

