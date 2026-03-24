# 🌍 TheLastCodeBender

> An open-source developer legacy project.
>  
> Clone. Contribute. Claim your rank.
>
> 🌐 **Live site:** [thelastcodebender.com](https://thelastcodebender.com/)

---

## 🧭 What Is This?

**TheLastCodeBender** is a global open-source movement where developers document their:

- 📖 Story  
- 🧠 Tech Stack  
- 🛠 Craft  
- 🌐 Social Presence  

Each contributor claims a unique rank in the **CodeBenders Hierarchy** by **Bending Specialization**:

- 🔥 **Frontend Bender** — FirstFrontendBender, SecondFrontendBender, … (200 ranks)  
- 🌊 **Backend Bender** — FirstBackendBender, SecondBackendBender, … (200 ranks)  
- 🌪 **FullStack Bender** — FirstFullStackBender, SecondFullStackBender, … (200 ranks)  
- ⚡ **Security Bender** — FirstSecurityBender, … (200 ranks)  
- 🧠 **AI Bender** — FirstAIBender, … (200 ranks)  
- 🏗 **DevOps Bender** — FirstDevOpsBender, … (200 ranks)  

Only one developer can claim each rank within a specialization.

First merged Pull Request wins the rank.

---

# 🚀 How to Contribute

Becoming a CodeBender takes 5 simple steps.

---

## 1️⃣ Fork & Clone

Fork this repository and clone it locally:

```bash
git clone https://github.com/YOUR_USERNAME/TheLastCodeBender.git
cd TheLastCodeBender
```

---

## 2️⃣ Choose an Available Rank

Navigate to:

```
CodeBenders/
```

Choose a **Bending Specialization** folder, then choose the next available rank folder inside it:

```
CodeBenders/
  Frontend Bender/
    FirstFrontendBender/
    SecondFrontendBender/
    ...
  Backend Bender/
    FirstBackendBender/
    ...
  FullStack Bender/
  Security Bender/
  AI Bender/
  DevOps Bender/
```

Each specialization has 200 ranks (First… through 200th). If a folder already contains a completed profile, that rank is taken.

Only one developer per rank per specialization.

---

## 3️⃣ Complete Your Profile Structure

Inside your chosen folder, you must fill the following structure:

```
story/
stack/
assets/
socials/
```

---

### 📖 story/

Create:

- `story.md` → Your journey into tech
- `origin.md` → How you started coding
- `philosophy.md` → How you think about engineering

---

### 🧠 stack/

Create:

`stack.json`

Example:

```json
{
  "languages": ["JavaScript", "TypeScript", "Python"],
  "frameworks": ["React", "Node.js", "Next.js"],
  "experience_years": 5,
  "specialization": "Full Stack Development"
}
```

---

### 🖼 assets/

Add:

- `avatar.png` (square recommended)
- Optional banner image

---

### 🌐 socials/

Create:

`socials.json`

Example:

```json
{
  "github": "https://github.com/yourusername",
  "linkedin": "https://linkedin.com/in/yourprofile",
  "portfolio": "https://yourwebsite.com",
  "twitter": "https://twitter.com/yourhandle"
}
```

---

## 4️⃣ Follow Contribution Rules

To maintain quality and professionalism:

✅ Write clearly and professionally  
✅ No offensive, political, or inappropriate content  
✅ Keep file structure intact  
✅ Do not modify other contributors’ folders  
✅ Do not rename ranks  
✅ Only edit your claimed folder  

Low-effort submissions may be rejected.

---

## 5️⃣ Submit Your Pull Request

Create a new branch:

```bash
git checkout -b claim-TheSecondCodeBender
```

Add your changes:

```bash
git add .
git commit -m "Claim TheSecondCodeBender and add profile"
git push origin claim-TheSecondCodeBender
```

Open a Pull Request.

### PR Title Example

```
Claiming TheSecondCodeBender – Your Name
```

### PR Description Example

```
This PR claims TheSecondCodeBender rank and includes my story, stack, assets, and socials.
```

---

# 🏆 Rank Assignment Rules

- Ranks are assigned in order of merged Pull Requests
- First valid, complete PR wins the rank
- If two contributors claim the same rank:
  - The first approved PR gets merged
  - The other contributor must choose the next available rank

---

# 🧠 CodeBenders Philosophy

Being a CodeBender means:

- Always learning  
- Building with purpose  
- Respecting the craft  
- Sharing your journey  
- Helping others grow  

It is not about knowing everything.

It is about being willing to learn anything.

---

# ❓ FAQ

### Can I update my profile later?
Yes. Submit a new PR updating your folder.

### Can I claim multiple ranks?
No. One developer = one rank.

### Can beginners join?
Absolutely. Your journey matters at every level.

---

# 🌟 Final Call

Clone. Contribute. Claim your rank.

Welcome to the CodeBenders Hierarchy.

---

## Environment Setup

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY
# See supabase/README.md for the full setup guide
```

---

# 🛠 Running the Project Locally

Follow these steps to run TheLastCodeBender project on your local machine:

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm**, **yarn**, or **bun** package manager

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/TheLastCodeBender.git
cd TheLastCodeBender
```

### 2. Install Dependencies

Choose one of the following package managers:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```


### 3. Start the Development Server

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```


The development server will start and you can access the application at `http://localhost:5173` (or the port shown in your terminal).

> 🌐 **Live site:** [thelastcodebender.com](https://thelastcodebender.com/)

