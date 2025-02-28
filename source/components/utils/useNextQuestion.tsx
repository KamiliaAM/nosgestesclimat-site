import { DottedName } from 'modele-social'
import Engine from 'publicodes'
import {
	countBy,
	descend,
	difference,
	equals,
	flatten,
	head,
	identity,
	keys,
	last,
	length,
	map,
	mergeWith,
	pair,
	pipe,
	sortBy,
	sortWith,
	takeWhile,
	zipWith,
} from 'ramda'
import { useContext, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { Simulation, SimulationConfig } from 'Reducers/rootReducer'
import {
	answeredQuestionsSelector,
	configSelector,
	currentQuestionSelector,
	objectifsSelector,
	situationSelector,
} from 'Selectors/simulationSelectors'
import { EngineContext } from './EngineContext'

type MissingVariables = Partial<Record<DottedName, number>>
export function getNextSteps(
	missingVariables: Array<MissingVariables>
): Array<DottedName> {
	const byCount = ([, [count]]: [unknown, [number]]) => count
	const byScore = ([, [, score]]: [unknown, [unknown, number]]) => score

	const missingByTotalScore = missingVariables.reduce(
		mergeWith((a, b) => a + b),
		{}
	)

	const innerKeys = flatten(map(keys, missingVariables)),
		missingByTargetsAdvanced = Object.fromEntries(
			Object.entries(countBy(identity, innerKeys)).map(
				// Give higher score to top level questions
				([name, score]) => [
					name,
					score + Math.max(0, 4 - name.split('.').length),
				]
			)
		)

	const missingByCompound = mergeWith(
			pair,
			missingByTargetsAdvanced,
			missingByTotalScore
		),
		pairs = Object.entries(missingByCompound),
		sortedPairs = sortWith([descend(byCount), descend(byScore) as any], pairs)
	return map(head, sortedPairs) as any
}

// Max : 1
// Min -> 0
const questionDifference = (rule1 = '', rule2 = '') =>
	1 /
	(1 +
		pipe(
			zipWith(equals),
			takeWhile(Boolean),
			length
		)(rule1.split(' . '), rule2.split(' . ')))

export function getNextQuestions(
	missingVariables: Array<MissingVariables>,
	questionConfig: SimulationConfig['questions'] = {},
	answeredQuestions: Array<DottedName> = [],
	situation: Simulation['situation'] = {},
	engine: Engine
): Array<DottedName> {
	const {
		'non prioritaires': notPriority = [],
		'liste prioritaire': priority = [],
		'liste blanche': whitelist = [],
		'liste noire': blacklist = [],
	} = questionConfig

	let nextSteps = difference(getNextSteps(missingVariables), answeredQuestions)
	nextSteps = nextSteps.filter(
		(step) =>
			(!whitelist.length || whitelist.some((name) => step.startsWith(name))) &&
			(!blacklist.length || !blacklist.some((name) => step.startsWith(name)))
	)

	const nextQuestions = nextSteps.filter((name) => {
		const rule = engine.getRule(name)
		return rule.rawNode.question != null
	})
	const lastStep = last(answeredQuestions)
	// L'ajout de la réponse permet de traiter les questions dont la réponse est
	// "une possibilité", exemple "contrat salarié . cdd"
	const lastStepWithAnswer =
		lastStep && situation[lastStep]
			? ([lastStep, situation[lastStep]]
					.join(' . ')
					.replace(/'/g, '')
					.trim() as DottedName)
			: lastStep
	return sortBy((question) => {
		const indexList =
			whitelist.findIndex((name) => question.startsWith(name)) + 1
		const indexNotPriority =
			notPriority.findIndex((name) => question.startsWith(name)) + 1
		const indexPriority =
			priority.findIndex((name) => question.startsWith(name)) === -1 ? 0 : -1
		const differenceCoeff = questionDifference(question, lastStepWithAnswer)
		return indexList + indexNotPriority + indexPriority + differenceCoeff
	}, nextQuestions)
}

export const useNextQuestions = function (): Array<DottedName> {
	const objectifs = useSelector(objectifsSelector)
	const answeredQuestions = useSelector(answeredQuestionsSelector)
	const currentQuestion = useSelector(currentQuestionSelector)
	const questionsConfig = useSelector(configSelector).questions ?? {}
	const situation = useSelector(situationSelector)
	const engine = useContext(EngineContext)
	const missingVariables = objectifs.map((node) =>
		!engine ? {} : engine.evaluate(node).missingVariables ?? {}
	)
	const nextQuestions = useMemo(() => {
		return engine
			? getNextQuestions(
					missingVariables,
					questionsConfig,
					answeredQuestions,
					situation,
					engine
			  )
			: []
	}, [missingVariables, questionsConfig, answeredQuestions, situation])
	if (currentQuestion && currentQuestion !== nextQuestions[0]) {
		return [currentQuestion, ...nextQuestions]
	}
	return nextQuestions
}

export function useSimulationProgress(): number {
	const numberQuestionAnswered = useSelector(answeredQuestionsSelector).length
	const numberQuestionLeft = useNextQuestions().length

	return (
		numberQuestionAnswered / (numberQuestionAnswered + numberQuestionLeft) || 0
	)
}
