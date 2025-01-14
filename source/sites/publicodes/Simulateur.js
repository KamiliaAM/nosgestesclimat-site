import { setSimulationConfig } from 'Actions/actions'
import { extractCategories } from 'Components/publicodesUtils'
import { buildEndURL } from 'Components/SessionBar'
import Simulation from 'Components/Simulation'
import Title from 'Components/Title'
import { useEngine } from 'Components/utils/EngineContext'
import { Markdown } from 'Components/utils/markdown'
import { motion } from 'framer-motion'
import { utils } from 'publicodes'
import { useEffect } from 'react'
import { Trans } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FullName } from '../../components/publicodesUtils'
import Meta from '../../components/utils/Meta'
import BandeauContribuer from './BandeauContribuer'
import InlineCategoryChart from './chart/InlineCategoryChart'
import { enquêteSelector } from './enquête/enquêteSelector'
import { questionConfig } from './questionConfig'
import ScoreBar from './ScoreBar'

const equivalentTargetArrays = (array1, array2) =>
	array1.length === array2.length &&
	array1.every((value, index) => value === array2[index])

const Simulateur = () => {
	const urlParams = useParams()
	const objectif = urlParams['*'],
		decoded = utils.decodeRuleName(objectif),
		rules = useSelector((state) => state.rules),
		rule = rules[decoded],
		engine = useEngine(),
		evaluation = engine.evaluate(decoded),
		dispatch = useDispatch(),
		config = {
			objectifs: [decoded],
			questions: questionConfig,
		},
		configSet = useSelector((state) => state.simulation?.config),
		categories = decoded === 'bilan' && extractCategories(rules, engine)
	const tutorials = useSelector((state) => state.tutorials)
	const url = useLocation().pathname

	const localisation = useSelector((state) => state.localisation)

	useEffect(() => {
		!equivalentTargetArrays(config.objectifs, configSet?.objectifs || []) &&
			dispatch(setSimulationConfig(config, url))
	}, [])

	const isMainSimulation = decoded === 'bilan'
	if (!configSet) {
		return null
	}

	const displayScoreExplanation =
			isMainSimulation && !tutorials.scoreExplanation,
		displayTutorial = isMainSimulation && !tutorials.testIntro

	return (
		<div>
			<Meta title={evaluation.title} />
			<Title>
				<Trans>Le test</Trans>
			</Title>
			<div>
				{!displayTutorial && (
					<motion.div
						initial={
							!displayScoreExplanation ? false : { opacity: 0, scale: 0.8 }
						}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.5 }}
					>
						<ScoreBar />
					</motion.div>
				)}
				{!isMainSimulation && (
					<h1>
						{evaluation.rawNode.title || (
							<FullName dottedName={evaluation.dottedName} />
						)}
					</h1>
				)}
				{!displayTutorial ? (
					!displayScoreExplanation && (
						<Simulation
							orderByCategories={categories}
							customEnd={
								isMainSimulation ? (
									<MainSimulationEnding {...{ rules, engine }} />
								) : rule.description ? (
									<Markdown children={rule.description} />
								) : (
									<EndingCongratulations />
								)
							}
							explanations={<InlineCategoryChart />}
						/>
					)
				) : (
					<TutorialRedirection />
				)}
			</div>
			<BandeauContribuer />
		</div>
	)
}

const TutorialRedirection = () => {
	return <Navigate to="/tutoriel" replace />
}

const MainSimulationEnding = ({ rules, engine }) => {
	const enquête = useSelector(enquêteSelector)
	// Necessary to call 'buildEndURL' with the latest situation

	return (
		<div
			css={`
				img {
					width: 8rem;
					height: auto;
				}
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding: 1rem;
			`}
		>
			<img
				src="/images/glowing-ngc-star.svg"
				width="100"
				height="100"
				aria-hidden="true"
			/>
			<p>
				<Trans>Vous avez terminé le test 👏</Trans>
			</p>
			<Link
				to={buildEndURL(rules, engine)}
				className="ui__ button cta plain"
				data-cypress-id="see-results-link"
			>
				<Trans>Voir mon résultat</Trans>
			</Link>
			{!enquête && (
				<>
					<Trans>ou</Trans>
					<Link to="/profil" css="">
						<Trans>Modifier mes réponses</Trans>
					</Link>
				</>
			)}
		</div>
	)
}

export default Simulateur

const EndingCongratulations = () => (
	<h3>
		<Trans>🌟 Vous avez complété cette simulation</Trans>
	</h3>
)
