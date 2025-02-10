import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './tailwind.css'

import App from './App.jsx'
import Drag from './dragAndDrop.jsx'

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <App/>
    </StrictMode>
)