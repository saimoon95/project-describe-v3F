# Describe

A modern, responsive web application for image recognition and analysis built with React, Tailwind CSS, and Google's Gemini AI Vision API.

## Features

- 🖼️ **Image Upload**: Drag and drop or click to upload images
- ⚙️ **Customizable Settings**: Adjust character limits for title, description, and tags
- 🎨 **Modern UI**: Beautiful, responsive design with Tailwind CSS
- 🔄 **Real-time Processing**: Loading states and progress indicators
- 📱 **Mobile Responsive**: Works perfectly on all device sizes
- 🤖 **AI-Powered Analysis**: Real image analysis using Google's Gemini Vision API

## Screenshots

The app features a clean, modern interface with:
- Gradient background
- Card-based layout
- Interactive sliders for settings
- Real-time preview of uploaded images
- Beautiful results display with AI-generated content

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn
- Google Gemini API key (already configured)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd describe
```

2. Install dependencies:
```bash
npm install
```

3. Start the development servers:
   ```bash
   npm run dev
   ```
   This will start both the React frontend (port 3000) and the backend server (port 3001).

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Usage

1. **Upload an Image**: Click the upload area or drag and drop an image file
2. **Adjust Settings**: Use the sliders to set character limits for:
   - Title (10-100 characters)
   - Description (50-500 characters)
   - Tags (5-50 characters)
3. **Generate Results**: Click the "Generate Results" button to analyze the image
4. **View Results**: See the AI-generated title, description, and tags from Gemini Vision API

## Technology Stack

- **Frontend**: React 19.1.1
- **Styling**: Tailwind CSS 3.4.17
- **Backend**: Express.js with Google Gemini Vision API
- **AI Service**: Google Gemini Pro Vision Model
- **Build Tool**: Create React App
- **Package Manager**: npm

## Project Structure

```
describe/
├── public/                 # Static files
├── src/
│   ├── App.js             # Main application component
│   ├── App.css            # Custom styles
│   ├── index.js           # Application entry point
│   └── index.css          # Global styles with Tailwind
├── server.js              # Express server with Gemini API
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
└── postcss.config.js      # PostCSS configuration
```

## API Configuration

The app uses Google's Gemini Vision API for real-time image analysis.

### Gemini API Setup
1. ✅ **Already Configured**: The API key is configured in the server
2. **Model**: Uses `gemini-pro-vision` for image analysis
3. **Features**: 
   - Intelligent image description
   - Contextual title generation
   - Relevant tag extraction
   - Character limit enforcement

### Architecture
- **Frontend**: React app running on port 3000
- **Backend**: Express server running on port 3001
- **API**: Google Gemini Vision API with real-time processing

### Security Notes
- API key is securely stored in the backend
- No sensitive data is exposed to the frontend
- The backend server handles all API communication
- Fallback responses for error handling

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run server` - Runs only the backend server
- `npm run dev` - Runs both frontend and backend concurrently
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (not recommended)

## Customization

### Styling Customization

The app uses Tailwind CSS for styling. You can customize:

- Colors: Modify the color classes in the components
- Layout: Adjust the grid and spacing classes
- Components: Update the card styles and button designs

### API Customization

To modify the Gemini API behavior:

1. Edit the prompt in `server.js` around line 40
2. Adjust the model parameters in the server setup
3. Modify the response processing logic

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

If you encounter any issues or have questions, please open an issue on the repository.

---

**Note**: This application now uses Google's Gemini Vision API for real image analysis. The AI provides intelligent, contextual descriptions, titles, and tags based on the actual content of uploaded images.
