<table class="{{classPrefix}}-date {{skin}}" data-role="date-column">
	<tr class="{{classPrefix}}-day-column">
		{{each day as item index}}
			<th class="{{classPrefix}}-day {{classPrefix}}-day-{{item.value}}" data-role="{{item.role}}" data-value="{{item.value}}">{{item.label}}</th>
		{{/each}}
	</tr>
	<tr class="{{classPrefix}}-date-column">
	{{each date as item index}}
		{{if index%7 == 0 && index > 0 && index < date.length}}
			</tr><tr class="{{classPrefix}}-date-column">
		{{/if}}

		<td data-role="{{item.role}}" data-value="{{item.value}}" class="
			{{item.className}} {{classPrefix}}-day-{{item.day}}

			{{if item.disable}}
				{{disableClass}}
			{{else}}
				{{if selected == item.value}} {{focusClass}}{{/if}}
			{{/if}}
		">{{item.label}}</td>

	{{/each}}
	</tr>
</table>