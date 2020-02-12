import React, { useState, createContext } from 'react';
import { HashRouter } from 'react-router-dom';
import Routes from './routes';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';

export const DarkModeContext = createContext(null);

export default function App() {
	const [darkMode, setDarkMode] = useState(false);
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
				<HashRouter>
					<Routes />
				</HashRouter>
			</DarkModeContext.Provider>
		</ThemeProvider>
	);
}
