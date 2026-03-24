import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import FormBuilderApp from './FormBuilderBoiler.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <FormBuilderApp />
  </StrictMode>
)
