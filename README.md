# Church Morning Preaching App

A modern, responsive Progressive Web App (PWA) designed for church communities to share and access spiritual content including audio sermons, video teachings, and inspirational images.

## Features

### 🎵 Media Management
- **Audio Player**: Full-featured audio player with progress control, volume adjustment, and background playback
- **Video Player**: Professional video player with fullscreen support and custom controls
- **Image Viewer**: High-quality image display with fullscreen modal and zoom capabilities

### 🌍 Multi-Language Support
- French and English language support
- Dynamic language switching with context persistence
- Localized content and interface elements

### 🔐 Authentication
- LocalStorage-based authentication system (temporary implementation)
- User registration and login forms
- Secure session management

### 💳 Payment Integration
- Lygos payment gateway integration for church donations
- Multiple donation amount options
- Secure payment processing with modern UI

### 📱 Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface elements
- Smooth animations and micro-interactions
- Church-themed design with subtle spiritual symbols

### 🎨 Design Features
- Soft, professional color palette inspired by church aesthetics
- Gradient backgrounds with subtle light effects
- Glass morphism and backdrop blur effects
- Smooth transitions and hover states
- Modern typography and spacing system

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React with custom church symbols
- **Build Tool**: Vite for fast development and building
- **State Management**: React Context API
- **Authentication**: LocalStorage (temporary, ready for Supabase migration)
- **Payment**: Lygos payment gateway integration

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Shared utility components
│   ├── content/        # Content display components
│   ├── home/           # Home page specific components
│   ├── layout/         # Layout and navigation components
│   ├── media/          # Media player components
│   └── payment/        # Payment integration components
├── contexts/           # React context providers
├── data/              # Static data and translations
├── pages/             # Main page components
├── types/             # TypeScript type definitions
└── utils/             # Utility functions

```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## PWA Conversion Ready

The application structure is designed to be easily converted to a Progressive Web App:

- Service worker registration ready
- Manifest file structure prepared
- Offline-first architecture considerations
- Mobile-optimized performance
- App-like navigation and user experience

## Supabase Integration

The app is prepared for Supabase integration:

- Authentication context ready for Supabase Auth migration
- Content models designed for Supabase database schema
- API service layer prepared for real-time data
- File storage integration ready for media content

## Contributing

This application serves as a foundation for church communities to share spiritual content and engage with their members through modern digital platforms."# mema_ok_update" 
