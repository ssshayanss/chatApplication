import { Container, Card } from 'react-bootstrap';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { RootPage, RegisterPage, LoginPage, DashboardPage, ChatRoomPage } from './pages';

const App = () => (
	<Container className="vh-100 d-flex justify-content-center align-items-center">
		<Card className="w-100 shadow-lg">
			<BrowserRouter>
				<Switch>
					<Route exact path="/" component={RootPage} />
					<Route path="/register" component={RegisterPage} />
					<Route path="/login" component={LoginPage} />
					<Route path="/dashboard" component={DashboardPage} />
					<Route path="/chatroom/:id" component={ChatRoomPage} />
				</Switch>
			</BrowserRouter>	
		</Card>
	</Container>
);

export default App;