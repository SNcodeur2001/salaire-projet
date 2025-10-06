#!/bin/bash

# Script to create a simple employee user with EMPLOYE role via backend API

API_URL="http://localhost:3000/api/register"  # Adjust if needed

read -p "Email: " email
read -sp "Password: " password
echo
read -p "First Name: " firstName
read -p "Last Name: " lastName
read -p "Poste: " poste
read -p "Contract Type (JOURNALIER, FIXE, HONORAIRE): " contract
read -p "Base Salary: " baseSalary
read -p "Entreprise ID (optional): " entrepriseId

json_data=$(jq -n \
  --arg email "$email" \
  --arg password "$password" \
  --arg role "EMPLOYE" \
  --arg firstName "$firstName" \
  --arg lastName "$lastName" \
  --arg poste "$poste" \
  --arg contract "$contract" \
  --arg baseSalary "$baseSalary" \
  --arg entrepriseId "$entrepriseId" \
  '{
    email: $email,
    password: $password,
    role: $role,
    entrepriseId: ($entrepriseId // null),
    employeeData: {
      firstName: $firstName,
      lastName: $lastName,
      poste: $poste,
      contract: $contract,
      baseSalary: ($baseSalary | tonumber)
    }
  }')

echo "Creating user..."
curl -X POST "$API_URL" -H "Content-Type: application/json" -d "$json_data"
echo
