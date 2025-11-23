# Bounty Application

A guided **3-step Bounty Creation Wizard** that allows users to publish bounties with structured details, backer information, and reward settings. The wizard ends with a clean confirmation page showing a full summary and JSON payload of the submitted bounty.

---

## 📌 Project Overview

This application allows users to create a bounty using a **structured 3-step workflow**:

### **1️⃣ Basics**
- Bounty title  
- Description  
- Project name  
- Bounty type  
- Dominant impact core  
- Mode (Digital / Physical)  
- Location + radius (if physical)

### **2️⃣ Backer (Optional)**
- Add a backer/sponsor name  
- Upload logo  
- Custom message  

### **3️⃣ Rewards & Publish**
- Total reward budget  
- Number of winners  
- Per-winner calculation  
- Automatic currency conversions  
- Failure threshold  
- Impact certificate (optional)  
- Choose up to 4 SDGs  
- Expiration date + auto time remaining  

When the user submits, they are redirected to a **Confirmation page** that displays all collected data in a clean summary including:

✔ Reward breakdown  
✔ Timeline  
✔ Impact certificate data  
✔ Selected SDGs  
✔ Auto-formatted estimated completion  
✔ JSON payload  

---

## 🧰 Technology Stack

### **Frontend**
- Next.js 16 (App Router, Turbopack)  
- React 18  
- TypeScript  
- TailwindCSS  
- Custom UI components (Button, Select, NumberInput, TextInput, Toggle, etc.)

### **State Management**
- React Context API  
- Centralized reducer  
- Global provider: `BountyProvider`

### **Backend**
- Next.js API Route  
  `app/api/submit/route.ts`  
  (Simulates storing & returning submission)

### **Additional Tools**
- LocalStorage for backup persistence  
- ESLint / Prettier  
- Git + GitHub  

---

## 📁 Project Structure

project/

      │
      ├── app/
      │ ├── api/
      │ │ └── submit/route.ts
      │ ├── wizard/
      │ ├── layout.tsx
      │ │ ├── step/1/page.tsx
      │ │ ├── step/2/page.tsx
      │ │ └── step/3/page.tsx
      │ ├── confirmation/page.tsx
      │ └── result/page.tsx
      │
      ├── components/
      │ ├── Confirmation.tsx
      │ ├── ResultPage.tsx
      │ ├── providers/
      │ │ └── BountyProviders.tsx
      │ ├── steps/
      │ │ ├── Step1Basic.tsx
      │ │ ├── Step2Backer.tsx
      │ │ └── Step3Rewards.tsx
      │ ├── ui/
      │ │ ├── Button.tsx
      │ │ ├── FileUpload.tsx
      │ │ ├── NumberInput.tsx
      │ │ ├── RadioGroup.tsx
      │ │ ├── Select.tsx
      │ │ ├── Textarea.tsx
      │ ├── TextInput.tsx
      │ │ └── Toggle.tsx
       └── widgets/
      │ └── Sidebar.tsx
      │
      ├── hooks/
      │ └── useValidation.ts
      │
      ├── state/
      │ ├── BountyContext.tsx
      │ └── types.ts
      │
      ├── public/assets/
      │ ├── target.png
      │ └── target.svg
      |
      ├── package.json
      ├── README.md
      └── tsconfig.json


---

## ⚙️ Setup & Run Instructions

### **1. Clone the repository**
```sh
git clone https://github.com/manognya66/BountyWizard.git
cd BountyWizard
```
### **2. npm install
```sh
  npm install
```
### **3. Start development
```sh
  npm run dev
```
### **4. Build production
```sh
  npm run build
```
### **5. Start production
```sh
  npm start
```

Hosted on Vercel:  https://bounty-wizard-git-main-shashanks-projects-f0fb40d9.vercel.app/wizard/step/1
