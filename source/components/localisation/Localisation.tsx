import supportedCountries from 'Components/localisation/supportedCountries.yaml'
import useLocalisation, {
	getFlagImgSrc,
	getCountryNameInFrench,
	isRegionSupported,
	getLocalisationPullRequest,
} from 'Components/localisation/useLocalisation'
import { Trans } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { setLocalisation, resetLocalisation } from '../../actions/actions'
import { usePersistingState } from '../../components/utils/persistState'
import { capitalise0 } from '../../utils'
import IllustratedMessage from '../ui/IllustratedMessage'
import NewTabSvg from '../utils/NewTabSvg'
import { getSupportedFlag } from './useLocalisation'

export default () => {
	const [chosenIp, chooseIp] = usePersistingState('IP', undefined)
	const localisation = useLocalisation(chosenIp)
	const dispatch = useDispatch()

	const [messagesRead, setRead] = usePersistingState(
		'localisationMessagesRead',
		[]
	)

	const supported = isRegionSupported(localisation)

	const countryName = getCountryNameInFrench(localisation?.country.code)

	return (
		<div>
			<h2>
				<Trans>📍 Région de simulation</Trans>
			</h2>
			{localisation != null ? (
				supported ? (
					<p>
						{localisation.userChosen ? (
							<span>
								<Trans>Vous avez choisi</Trans>{' '}
							</span>
						) : (
							<span>
								<Trans>
									Nous avons détecté que vous faites cette simulation depuis
								</Trans>{' '}
							</span>
						)}
						{countryName}
						<img
							src={getSupportedFlag(localisation)}
							aria-hidden="true"
							css={`
								height: 1rem;
								margin: 0 0.3rem;
								vertical-align: sub;
							`}
						/>
						.{' '}
						{localisation.userChosen && (
							<button
								className="ui__ dashed-button"
								onClick={() => {
									dispatch(resetLocalisation())
									dispatch({
										type: 'SET_PULL_REQUEST_NUMBER',
										number: null,
									})
								}}
							>
								<Trans>Revenir chez moi 🔙</Trans>
							</button>
						)}
					</p>
				) : (
					<p>
						<Trans>
							Nous avons détecté que vous faites cette simulation depuis
						</Trans>{' '}
						{getCountryNameInFrench(localisation?.country.code)}
						<img
							src={
								getSupportedFlag(localisation) ||
								getFlagImgSrc(localisation?.country.code)
							}
							aria-hidden="true"
							css={`
								height: 1rem;
								margin: 0 0.3rem;
								vertical-align: sub;
							`}
						/>
						.
						<Trans i18nKey="components.localisation.Localisation.warnMessage">
							Pour le moment, il n'existe pas de modèle de calcul pour{' '}
							{{ countryName }}, vous utilisez le modèle Français par défault.
						</Trans>
					</p>
				)
			) : (
				<p>
					<Trans i18nKey="components.localisation.Localisation.warnMessage2">
						Nous n'avons pas pu détecter votre pays de simulation. Vous utilisez
						le modèle Français par défault.
					</Trans>{' '}
				</p>
			)}

			<details>
				<summary>
					<Trans>Choisir une autre région</Trans>
				</summary>
				<ul>
					{supportedCountries.map(
						({ nom, code, inactif }) =>
							(NODE_ENV === 'development' || !inactif) && (
								<li
									key={code}
									onClick={() => {
										const newLocalisation = {
											country: { name: nom, code },
											userChosen: true,
										}
										dispatch(setLocalisation(newLocalisation))
										const localisationPR =
											getLocalisationPullRequest(newLocalisation)
										dispatch({
											type: 'SET_PULL_REQUEST_NUMBER',
											number: localisationPR,
										})
										setRead([])
									}}
								>
									<button>{capitalise0(nom)}</button> {inactif && '[dev]'}
								</li>
							)
					)}
				</ul>
				<IllustratedMessage
					emoji="🌐"
					message={
						<div>
							<p>
								<Trans>
									Envie de contribuer à une version pour votre région ?
								</Trans>{' '}
								<a
									target="_blank"
									href="https://github.com/datagir/nosgestesclimat/blob/master/INTERNATIONAL.md"
								>
									<Trans>Suivez le guide !</Trans>
									<NewTabSvg />
								</a>
							</p>
						</div>
					}
				/>
			</details>
		</div>
	)
}
