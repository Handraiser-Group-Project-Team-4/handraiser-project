import React, { useState, createContext } from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import { SnackbarProvider } from 'notistack';
import 'status-indicator/styles.css';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import DarkMode from './DarkMode';

export const DarkModeContext = createContext(null);

export default function App() {
	const { darkMode, setDarkMode } = DarkMode();

	const theme = React.useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: darkMode ? 'dark' : 'light'
				}
			}),
		[darkMode]
	);

	return (
		<ThemeProvider theme={theme}>
			<DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
				<SnackbarProvider maxSnack={5} hideIconVariant={false} anchorOrigin={{vertical: "top",horizontal: "right"}} autoHideDuration={3000}>
					<HashRouter>
						<Routes />
					</HashRouter>
				</SnackbarProvider>
			</DarkModeContext.Provider>
		</ThemeProvider>
	);
}
