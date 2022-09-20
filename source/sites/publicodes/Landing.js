import React, { useState } from 'react'
import animate from 'Components/ui/animate'
import LogoADEME from 'Images/logoADEME.svg'
import { useContext, Suspense } from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import NewsBanner from '../../components/NewsBanner'
import { openmojiURL } from '../../components/SessionBar'
import Meta from '../../components/utils/Meta'
import { TrackerContext } from '../../components/utils/withTracker'
import DocumentationButton from './DocumentationButton'
import Illustration from 'Images/ecolab-climat-dessin.svg'
import { useProfileData } from './Profil'
import landingMd from 'raw-loader!./landing.md'
import Markdown from 'markdown-to-jsx'

const SurveyModal = React.lazy(() => import('./SurveyModal'))

export default () => {
	const tracker = useContext(TrackerContext)
	const [showSurveyModal, setShowSurveyModal] = useState(false)

	return (
		<div
			css={`
				margin: 0 auto;
				border-radius: 1rem;
				> div > a {
				}
				display: flex;
				flex-direction: column;
				justify-content: space-evenly;
				align-items: center;
				min-height: 85vh;
				footer {
					margin-top: auto;
				}
			`}
		>
			<Meta
				title="Connaissez-vous votre empreinte climat ?"
				description="Testez votre empreinte carbone, tout seul ou en groupe. Découvrez la répartition de votre empreinte. Suivez le parcours de passage à l'action pour la réduire."
				image="https://nosgestesclimat.fr/images/dessin-nosgestesclimat.png"
			/>
			<div
				css={`
					display: flex;
					flex-direction: row;
					align-items: center;
					margin-top: 4rem;
					h1 {
						margin-top: 0.3rem;
						font-size: 220%;
						line-height: 1.1em;
						font-weight: bold;

						color: var(--darkColor);
					}
					p {
						font-size: 110%;
					}
				`}
			>
				<div
					css={`
						display: flex;
						flex-direction: column;
						max-width: 30rem;
					`}
				>
					<h1>Connaissez-vous votre empreinte sur le climat ?</h1>
					<p>
						En 10 minutes, obtenez une estimation de votre empreinte carbone de
						consommation.
					</p>
					<div css="margin: 1rem 0">
						<button
							className="ui__ link-button"
							onClick={() => setShowSurveyModal(true)}
						>
							Participez à notre enquête utilisateurs !
						</button>
						{showSurveyModal && (
							<Suspense fallback={''}>
								<SurveyModal
									showSurveyModal={showSurveyModal}
									setShowSurveyModal={setShowSurveyModal}
								/>
							</Suspense>
						)}
						<div
							css={`
								margin-top: 1rem;
								> a {
									margin-right: 1rem !important;
								}
							`}
						>
							<Link
								to="/simulateur/bilan"
								className="ui__ plain button cta"
								onClick={() =>
									tracker.push([
										'trackEvent',
										'NGC',
										'Clic CTA accueil',
										'Faire le test',
									])
								}
							>
								{emoji('▶️')} Faire le test
							</Link>
							<Link
								to="/groupe"
								className="ui__ button cta"
								onClick={() =>
									tracker.push([
										'trackEvent',
										'NGC',
										'Clic CTA accueil',
										'Faire le test à plusieurs',
									])
								}
							>
								{emoji('👥')} En groupe
							</Link>
						</div>
						<NewsBanner />
					</div>
				</div>
				<Illustration
					aira-hidden="true"
					css={`
						max-width: 30rem;
						height: auto;
						border-radius: 0.8rem;
						@media (max-width: 800px) {
							max-width: 95%;
						}
					`}
				/>
			</div>
			<div
				css={`
					background: var(--lightestColor);
					width: 100%;
					text-align: center;
					margin: 4rem 0;
					padding: 2rem 0;
				`}
			>
				<div className="ui__ container">
					<Markdown>{landingMd}</Markdown>
				</div>
			</div>

			<footer>
				<div
					css={`
						display: flex;
						align-items: center;
						justify-content: center;
						margin-bottom: 1rem;
						img {
							margin: 0 0.6rem;
						}
					`}
				>
					<img
						src="/images/marianne.svg"
						alt="République Française"
						css="height: 6rem; margin-right: .6rem"
						width="96"
						height="86"
					/>
					<a href="https://ademe.fr">
						<LogoADEME />
					</a>
					<a href="https://abc-transitionbascarbone.fr">
						<img
							css="height: 2rem; margin-left: 1rem !important"
							src="https://abc-transitionbascarbone.fr/wp-content/uploads/2022/02/logo-ABC-web.png"
							alt="Logo de l'Association pour la transition Bas Carbone"
							width="86"
							height="29"
						/>
					</a>
				</div>
				<div
					css={`
						display: flex;
						justify-content: center;
						align-items: center;
						flex-wrap: wrap;
						> * {
							margin: 0 0.6rem;
						}
						img {
							font-size: 120%;
						}
					`}
				>
					<Link to="/à-propos">À propos</Link>
					<DocumentationButton />
					<Link to="/diffuser">Diffuser</Link>
					<ProfileLink />
				</div>
				<div
					css={`
						display: flex;
						justify-content: center;
						align-items: center;
						> * {
							margin: 0 0.6rem;
							font-size: 80%;
						}
					`}
				>
					<Link to="/accessibilite" style={{ textDecoration: 'none' }}>
						Accessibilité : partiellement conforme
					</Link>
				</div>
			</footer>
		</div>
	)
}

const ProfileLink = () => {
	const { hasData } = useProfileData()
	if (!hasData) return null
	return (
		<animate.fromTop delay="1">
			<div
				css={`
					button {
						padding: 0 0.2rem !important;
						border-radius: 1rem !important;
					}
				`}
			>
				<Link
					to="/profil"
					title="Page profil"
					className="ui__ button plain small"
					css="border-radius: 2rem !important"
				>
					<img
						aria-hidden="true"
						src={openmojiURL('profile')}
						css="width: 2rem"
					/>
				</Link>
			</div>
		</animate.fromTop>
	)
}
