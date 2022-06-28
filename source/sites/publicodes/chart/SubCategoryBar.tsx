import { motion } from 'framer-motion'
import { useState } from 'react'
import CircledEmojis from 'Components/CircledEmojis'
import { findContrastedTextColor } from 'Components/utils/colors'
import TriangleShape from './TriangleShape'

export default ({
	nodeValue,
	total,
	icons,
	color,
	title,
	hideSmallerThanPercentage,
	key,
	delay = 0,
	indicator,
}) => {
	const [clicked, click] = useState(false)
	const percent = (nodeValue / total) * 100
	if (hideSmallerThanPercentage && percent < hideSmallerThanPercentage)
		return null // will be unreadable

	return (
		<motion.li
			initial={{ opacity: 0 }}
			animate={{ opacity: 1, width: `calc(${percent}% - 0px)` }}
			exit={{ width: 0, opacity: 0 }}
			transition={{ duration: 0.5, delay }}
			key={key}
			css={`
				border-right: 2px solid var(--lighterColor);
				background: ${color};
				cursor: pointer;
				position: relative;
			`}
			title={title}
			onClick={() => click(!clicked)}
		>
			{indicator && (
				<div
					css={`
						svg {
							width: 1rem;
							height: 1rem;
						}
						position: absolute;
						left: 50%;
						transform: translateX(-50%);
						top: -1.2rem;
					`}
				>
					<TriangleShape color={color} />
				</div>
			)}
			{clicked ? (
				<span
					key={title}
					css={`
						color: ${findContrastedTextColor(color, true)};
					`}
				>
					{title}
				</span>
			) : (
				<CircledEmojis emojis={icons} emojiTitle={title} />
			)}
		</motion.li>
	)
}
