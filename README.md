<div align="center" class="text-center">
<h1>NetTube</h1>
<p><em>Streamline your video experience, effortlessly engage and explore.</em></p>

<img alt="last-commit" src="https://img.shields.io/github/last-commit/yudswin/nettubefe?style=flat&amp;logo=git&amp;logoColor=white&amp;color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="repo-top-language" src="https://img.shields.io/github/languages/top/yudswin/nettubefe?style=flat&amp;color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="repo-language-count" src="https://img.shields.io/github/languages/count/yudswin/nettubefe?style=flat&amp;color=0080ff" class="inline-block mx-1" style="margin: 0px 2px;">
<p><em>Built with the tools and technologies:</em></p>
<img alt="DaisyUI" src="https://img.shields.io/badge/DaisyUI-1AD1A5.svg?style=flat&amp;logo=DaisyUI&amp;logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="React" src="https://img.shields.io/badge/React-61DAFB.svg?style=flat&amp;logo=React&amp;logoColor=black" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&amp;logo=TypeScript&amp;logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
</br>
<img alt="Vite" src="https://img.shields.io/badge/Vite-646CFF.svg?style=flat&amp;logo=Vite&amp;logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="ESLint" src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&amp;logo=ESLint&amp;logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
<img alt="Axios" src="https://img.shields.io/badge/Axios-5A29E4.svg?style=flat&amp;logo=Axios&amp;logoColor=white" class="inline-block mx-1" style="margin: 0px 2px;">
</div>

## Project Overview

NetTube is a video streaming application that allows users to browse, search, and watch videos online. The frontend is built with modern web technologies to provide a responsive and intuitive user experience.

### Key Features
This project aims to simplify the creation of engaging media platforms. The core features include:
<ul class="list-disc pl-4 my-0">
<li class="my-0">🎥 <strong>Dynamic User Interface:</strong> Provides a responsive design for seamless user interactions.</li>
<li class="my-0">🔒 <strong>User Authentication:</strong> Ensures secure access with a robust authentication system.</li>
<li class="my-0">🎬 <strong>Seamless Video Playback:</strong> Supports HLS streaming for smooth and uninterrupted viewing.</li>
<li class="my-0">🛠️ <strong>Component-Based Architecture:</strong> Promotes maintainability and scalability through reusable components.</li>
<li class="my-0">🎨 <strong>Tailored Styling with Tailwind CSS:</strong> Customizable design system for a cohesive visual identity.</li>
<li class="my-0">⚡ <strong>Efficient Development Workflow:</strong> Optimized build process with Vite, enhancing developer productivity.</li>
</ul>

## Technology Stack

- **React 19**: Frontend library for building user interfaces
- **TypeScript**: For type-safe code
- **Vite**: Build tool and development server
- **TailwindCSS**: Utility-first CSS framework for styling
- **DaisyUI**: Component library for Tailwind CSS
- **React Router**: For application routing
- **Axios**: For API requests
- **HLS.js**: For video streaming playback
- **TanStack Table**: For data table management

## Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nettubefe.git
   cd nettubefe
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:5173`

## Development

### Available Scripts
- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run lint`: Run ESLint to check code quality
- `npm run preview`: Preview the production build locally

## Project Documentation

### Architecture

The application follows a component-based architecture with the following structure:

```
src/
├── components/      # Reusable UI components
├── pages/           # Page components for routing
├── hooks/           # Custom React hooks
├── services/        # API service integrations
├── context/         # React context providers
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── assets/          # Static assets (images, fonts, etc.)
```

### Core Functionality

#### Authentication Flow
- JWT-based authentication
- Protected routes for authenticated users
- Role-based access control

#### Video Streaming
- HLS (HTTP Live Streaming) protocol support
- Adaptive bitrate streaming
- Video player with custom controls

#### Responsive Design
- Mobile-first approach
- Tablet and desktop optimizations
- Accessible UI components

### State Management
The application uses React's Context API for global state management, with specific contexts for:
- Authentication state
- User preferences
- Video player state

### API Integration
- RESTful API communication via Axios
- Interceptors for authentication headers
- Error handling and response normalization

## Configuration

### Environment Variables
Create a `.env` file in the root directory with the following variables:

```
VITE_API_URL=http://localhost:8000/api
VITE_MEDIA_URL=http://localhost:8000/media
VITE_AUTH_TOKEN_KEY=auth_token
```

### Building for Production

1. **Create production build**
   ```bash
   npm run build
   # or
   yarn build
   ```

2. **Test production build locally**
   ```bash
   npm run preview
   # or
   yarn preview
   ```

3. **Deployment options**
   - Static hosting (Netlify, Vercel, GitHub Pages)
   - Docker containerization
   - Traditional web servers (Nginx, Apache)

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Check import paths
   - Verify the module is installed
   - Run `npm install` to ensure dependencies are up to date

2. **CORS errors during API calls**
   - Ensure the API server allows requests from your frontend domain
   - Check that authentication headers are properly set

3. **Playback issues with video**
   - Verify HLS.js compatibility with your browser
   - Check network connectivity to media server
   - Ensure media formats are properly encoded

### Getting Help
- Open an issue on GitHub
- Check existing documentation
- Consult the React and Vite documentation for framework-specific issues

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
