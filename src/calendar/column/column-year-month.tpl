<table class="{{classPrefix}}-{{type}} {{skin}}" data-role="{{type}}-column">
	<tr class="{{classPrefix}}-{{type}}-column">
	{{each items as item index}}
		{{if index%3 == 0 && index > 0 && index < items.length}}
			</tr><tr class="ui-calendar-{{type}}-column">
		{{/if}}

		<td data-role="{{item.role}}" data-value="{{item.value}}" class="
			{{if item.disable}}
				{{disableClass}}
			{{else}}
				{{if selected == item.value}} {{focusClass}}{{/if}}
			{{/if}}
		">{{item.label}}</td>

	{{/each}}
	</tr>
</table>