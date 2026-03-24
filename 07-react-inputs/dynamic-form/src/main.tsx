import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ProfileList from './ProfileList.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProfileList />
  </StrictMode>,
)
