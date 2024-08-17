import './style.css'
import App from './components/App.ts'

document.querySelector<HTMLDivElement>('#app')!.appendChild(App().element);
