# E-Academy Institute of Technology (EIT)

A highly interactive, premium landing page for the E-Academy Institute of Technology. Designed to showcase career-focused curriculum tracks, mentorship programs, and a proven methodology for transitioning students into professional engineering and design roles.

## 🚀 Features

- **Premium UI/UX:** A stunning, light-mode editorial aesthetic utilizing our custom "Premium Modern Purple" brand colors.
- **Dynamic Curriculum Bento:** Powered by the custom `MagicBento` component with real-time cursor tracking, 3D tilt effects, interactive magnetic interactions, and dynamic mesh-gradient glowing borders.
- **Interactive Methodology Timeline:** Step-by-step guides wrapped in the bespoke `BorderGlow` component.
- **Infinite Tech Stack Loop:** An automated, infinitely scrolling `LogoLoop` component that displays the extensive tech stack taught at the academy, complete with responsive tooltip interactions powered by `shadcn/ui`.
- **Advanced Micro-Interactions:** Custom spring physics and orchestrated entry animations driven by `framer-motion` and `gsap`.
- **Fully Responsive:** Beautifully optimized across mobile, tablet, and desktop viewports.

## 🛠️ Technology Stack

This project is built using modern, production-ready frontend technologies:

- **Framework:** [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Component Library:** [shadcn/ui](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
- **Icons:** [Lucide React](https://lucide.dev/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Routing:** [React Router v7 (Future Flags)](https://reactrouter.com/)

## 📦 Getting Started

To run this project locally, follow these steps:

### Prerequisites

Ensure you have Node.js and npm installed on your local machine.

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Viswajith8025/e-academy.git
   cd e-academy
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root directory (if not already present). For local development, dummy variables will suffice until backend integration:
   ```env
   VITE_SUPABASE_URL="https://your-project-url.supabase.co"
   VITE_SUPABASE_ANON_KEY="your-anon-key"
   ```

4. **Start the Development Server**
   ```bash
   npm run dev
   ```

5. **View the Application**
   Open your browser and navigate to the local host URL provided in the terminal (usually `http://localhost:8080` or `http://localhost:8081`).

## 📁 Project Structure

- `/src/pages/Index.tsx` - The main landing page view orchestrating the premium experience.
- `/src/components/` - Custom and reusable UI components.
  - `MagicBento.tsx` - Advanced animated curriculum grid.
  - `BorderGlow.tsx` - Methodology timeline interactive wrapper.
  - `LogoLoop.tsx` - Infinite scrolling tech stack banner.
  - `RotatingText.tsx` / `GradientText.tsx` / `CountUp.tsx` - Hero section typography components.
- `/src/components/ui/` - Foundational UI primitives constructed via shadcn/ui.
- `/src/index.css` - Global stylesheet containing root CSS variables and brand tokens.

## 📄 License

This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.
