import './style.css'
import App from './components/app.ts'

document.querySelector<HTMLDivElement>('#app')!.appendChild(App().element);
