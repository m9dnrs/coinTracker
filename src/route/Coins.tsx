import { Helmet } from 'react-helmet';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { fetchCoins } from '../api';
import Header from '../components/Header';

const Container = styled.div`
	max-width: 480px;
	margin: 0 auto;
	padding: 0px 20px;
`;

const CoinsList = styled.ul``;

const Coin = styled.li`
	background-color: ${(props) => props.theme.cardBgColor};
	color: ${(props) => props.theme.textColor};
	border-radius: 15px;
	border: 1px solid white;
	margin-bottom: 10px;
	a {
		display: flex;
		align-items: center;
		padding: 20px;
		transition: color 0.2s ease-in;
	}
	&:hover {
		a {
			color: ${(props) => props.theme.accentColor};
		}
	}
`;

const Img = styled.img`
	width: 35px;
	height: 35px;
	margin-right: 10px;
`;

const Loader = styled.span`
	text-align: center;
	display: block;
`;

interface ICoin {
	id: string;
	name: string;
	symbol: string;
	type: string;
	rank: number;
	is_new: boolean;
}

function Coins() {
	const { isLoading, data } = useQuery<ICoin[]>('allCoins', fetchCoins);
	const title = '코인';
	return (
		<Container>
			<Helmet>
				<title>{title}</title>
			</Helmet>
			<Header title={title} />
			{isLoading ? (
				<Loader>Loading...</Loader>
			) : (
				<CoinsList>
					{data?.slice(0, 100).map((coin) => (
						<Coin key={coin.id}>
							<Link to={`/${coin.id}`} state={{ name: coin.name }}>
								<Img
									src={`https://cryptocurrencyliveprices.com/img/${coin.id}.png`}
								/>
								{coin.name} &rarr;
							</Link>
						</Coin>
					))}
				</CoinsList>
			)}
		</Container>
	);
}
export default Coins;
