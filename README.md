# 🎲 Decidr

> **Stop arguing about where to eat. Let Decidr decide.**

Decidr is a mobile app that solves the age-old group dilemma — *"Where do you want to eat?"* — by intelligently picking a great nearby restaurant for you. No more endless back-and-forth. Just open the app, and let it roll.

---

## 🍕 What It Does

Decidr uses your current location to find nearby restaurants and surfaces the **best possible option** based on our custom weighted algorithm. If you're not feeling the first pick, just **reroll** for another great choice.

No subscriptions. No sign-ups. Just decisions.

---

## ⚙️ How It Works

At the core of Decidr is a **rating-count weighted scoring algorithm**. Here's the idea:

A restaurant with a 4.8 ⭐ rating but only 3 reviews isn't necessarily better than one with a 4.5 ⭐ rating and 2,000 reviews. Decidr accounts for both **quality** *and* **credibility** by weighting scores based on the number of ratings — so you always get a recommendation you can trust.

The algorithm:
1. **Fetches nearby restaurants** based on your current location
2. **Scores each option** using a weighted formula that factors in average rating and review count
3. **Randomly selects** from the top-scoring results, so you get variety without sacrificing quality
4. **Lets you reroll** if you want to explore another great option

---

## 📱 Tech Stack

- **Frontend:** React Native (Expo) — TypeScript
- **Backend:** Node.js server — JavaScript
- **Architecture:** Client/server structure with REST API

---

## 🚀 Getting Started

**Prerequisites:** Node.js and npm installed.

```bash
# Clone the repository
git clone https://github.com/jadenseangmany/decidr.git
cd decidr

# Install dependencies
npm install

# Start the app
npx expo start
```

From there, you can open the app in:
- An **iOS Simulator**
- An **Android Emulator**
- **Expo Go** on your physical device

---

## 🗂️ Project Structure

```
decidr/
├── client/     # React Native (Expo) mobile app
├── server/     # Backend API server
└── README.md
```

---

## 📲 Coming Soon

Decidr will be available on:

- 🍎 **Apple App Store**
- 🤖 **Google Play Store**

Stay tuned!

---

## 👥 Contributors

Built with ❤️ by a team of 6:

- [@jadenseangmany](https://github.com/jadenseangmany)
- [@tsitu0](https://github.com/tsitu0)
- [@christxnele](https://github.com/christxnele)
- [@hlam8](https://github.com/hlam8)
- [@katelnyli](https://github.com/katelnyli)
- [@khanggn](https://github.com/khanggn)

---

## 🔗 Links

- **GitHub:** [github.com/jadenseangmany/decidr](https://github.com/jadenseangmany/decidr)
