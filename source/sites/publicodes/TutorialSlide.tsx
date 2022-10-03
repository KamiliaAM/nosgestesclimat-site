import { Link } from 'react-router-dom'

export default ({ children, last, skip }) => {
	return (
		<div
			className="ui__ card light colored content"
			css={`
				margin-top: 0.6rem;
				> svg,
				> img {
					margin: 0.4rem auto;
					display: block;
				}

				h1 {
					margin-top: 1rem;
					font-size: 160%;
					@media (max-height: 600px) {
						font-size: 140%;
					}
				}
				border: 2px solid var(--color);
			`}
		>
			{children}
			<div
				css={`
					display: flex;
					justify-content: center;
					margin: 2rem 0 0.6rem;
					> a {
						text-decoration: none;
					}
				`}
			>
				<Link to="/simulateur/bilan">
					<button
						className={`ui__ ${!last ? 'dashed-button' : 'button'}`}
						onClick={() => skip('testIntro')}
					>
						{!last ? 'Passer le tutoriel' : "C'est parti !"}
					</button>
				</Link>
			</div>
		</div>
	)
}
