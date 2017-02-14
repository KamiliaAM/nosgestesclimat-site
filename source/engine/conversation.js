import React from 'react'
import Explicable from '../components/conversation/Explicable'

export let constructStepMeta = ({question, dottedName, name}) => ({
	// name: dottedName.split(' . ').join('.'),
	name: dottedName,
	// question: question || name,
	question: <Explicable
		label={question || name}
		name={name}
		lightBackground={true}
	/>,
	title: name,
	dependencyOfVariables: ['chai pas'],

	// Legacy properties :

	visible: true,
	// helpText: 'Voila un peu d\'aide poto'
})