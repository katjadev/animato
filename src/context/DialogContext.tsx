import { 
  ReactNode, 
  createContext, 
  useContext, 
  useState, 
  FC,
} from 'react'
import LoginDialog from '@animato/components/login-dialog/LoginDialog';
import SignupDialog from '@animato/components/signup-dialog/SignupDialog';

export const DialogContext = createContext<{
  showLoginDialog: () => void,
  showSignupDialog: () => void,
}>({
  showLoginDialog: () => null,
  showSignupDialog: () => null,
})

interface DialogProviderProps {
  children?: ReactNode;
}

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false)
  const [isSignupDialogOpen, setIsSignupDialogOpen] = useState(false)

  const showLoginDialog = () => setIsLoginDialogOpen(true)
  const showSignupDialog = () => setIsSignupDialogOpen(true)

  return (
    <DialogContext.Provider value={{ 
      showLoginDialog, 
      showSignupDialog,
    }}>
      {children}
      <SignupDialog
        isOpen={isSignupDialogOpen} 
        onClose={() => setIsSignupDialogOpen(false)} 
      />
      <LoginDialog
        isOpen={isLoginDialogOpen} 
        onClose={() => setIsLoginDialogOpen(false)} 
      />
    </DialogContext.Provider>
  )
}

export const useDialog = () => useContext(DialogContext)