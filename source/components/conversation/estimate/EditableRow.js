import React from 'react'
import { motifList, freqList } from './dataHelp'

export default function EditableRow({
	editFormData,
	handleEditFormChange,
	handleCancelClick,
}) {
	return (
		<tr>
			<td>
				<select
					name="motif"
					className="ui__"
					value={editFormData.motif}
					onChange={handleEditFormChange}
				>
					{motifList.map((m) => (
						<option key={m.id} value={m.name}>
							{m.name}
						</option>
					))}
				</select>
			</td>
			<td>
				<input
					name="label"
					type="text"
					className="ui__"
					css={`
						width: 8rem !important;
					`}
					placeholder="Trajet (Optionnel)"
					value={editFormData.label}
					onChange={handleEditFormChange}
				/>
			</td>
			<td>
				<input
					name="distance"
					className="ui__"
					css={`
						width: 3rem !important;
					`}
					type="number"
					required
					value={editFormData.distance}
					onChange={handleEditFormChange}
				/>
			</td>
			<td>
				<select
					name="frequence"
					className="ui__"
					value={editFormData.frequence}
					onChange={handleEditFormChange}
				>
					{freqList.map((f) => (
						<option key={f.id} value={f.name}>
							{f.name}
						</option>
					))}
				</select>
			</td>
			<td>
				<input
					name="personnes"
					className="ui__"
					css={`
						width: 3rem !important;
					`}
					type="number"
					required
					placeholder="Nombre de personnes"
					value={editFormData.personnes}
					onChange={handleEditFormChange}
				/>
			</td>
			<td>
				<button type="submit">💾</button>
				<button type="button" onClick={handleCancelClick}>
					🔙
				</button>
			</td>
		</tr>
	)
}
