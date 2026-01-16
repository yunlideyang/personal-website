import WrapperRouters from "./router";
import ThemeProvider from './theme/ThemeProvider'
import ThemeToggle from './components/ThemeToggle/ThemeToggle'
export default function App() {

  return (
    <ThemeProvider>
      <ThemeToggle />
      <WrapperRouters />
    </ThemeProvider>
  )
}
