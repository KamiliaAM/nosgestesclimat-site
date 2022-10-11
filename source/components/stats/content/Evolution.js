import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Trans } from 'react-i18next'

import Tile from '../utils/Tile'

const Wrapper = styled(Tile.Content)`
	width: 40%;
	text-align: center;
	padding-top: 2rem;
	margin: 0 0.5rem 2rem 0.5rem;
	@media screen and (max-width: ${1200}px) {
		width: 100%;
		padding-top: 0rem;
	}
`

const TopBlock = styled.div`
	margin-bottom: 2rem;
	margin-top: 1rem;
	width: 100%;
	font-size: 150%;
	@media screen and (max-width: ${1200}px) {
		display: inline-flex;
		justify-content: center;
		align-items: baseline;
	}
`
const BlockWrapper = styled.div`
	width: 100%;

	@media screen and (max-width: ${1200}px) {
		display: inline-flex;
		justify-content: space-evenly;
	}
`

const Block = styled.div`
	@media screen and (max-width: ${1200}px) {
		width: 50%;
	}
`

const Number = styled.span`
	display: block;
	font-size: 2.5rem;
	font-weight: 800;
	line-height: 1;
	color: var(--color);
	transition: color 500ms ease-out;
`
const BigNumber = styled(Number)`
	font-size: 3.5rem;
`
const Small = styled.span`
	font-size: 0.75rem;
`
export default function Evolution(props) {
	const [percent, setPercent] = useState(0)
	useEffect(() => {
		const lastPeriod = props.reference - props.period
		const difference = props.period - lastPeriod
		setPercent((difference / lastPeriod) * 100)
	}, [props.period, props.reference])

	// We didn't track this stat at the beginning so we're guessing based on todays average completion
	const baseSimulations = 32015
	const simulations = props.simulations

	return (
		<Wrapper>
			<TopBlock>
				<BigNumber>
					{props.allTime.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}
				</BigNumber>{' '}
				&nbsp;<Trans>visites depuis le lancement</Trans>
			</TopBlock>
			<BlockWrapper>
				<Block>
					<Number>
						{percent > 0 && '+'}
						{Math.round(percent * 10) / 10}%
					</Number>
					<Trans>
						de visites ce mois ci
						<Small>&nbsp;(par rapport au mois d'avant)</Small>
					</Trans>
				</Block>
				<Block>
					<Number>
						{(simulations?.nb_visits + baseSimulations)
							.toString()
							.replace(/\B(?=(\d{3})+(?!\d))/g, '\u00A0')}
					</Number>{' '}
					<Trans>simulations terminées depuis le lancement</Trans>
				</Block>
			</BlockWrapper>
		</Wrapper>
	)
}
