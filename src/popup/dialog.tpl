<div class="{{classPrefix}} {{skin}}">
	<a class="{{classPrefix}}-close" title="Close" href="javascript:;" data-role="close">×</a>
	<table class="{{classPrefix}}-grid">
		{{if title}}
			<tr>
				<td class="{{classPrefix}}-header" data-role="header">
					<div class="{{classPrefix}}-title" data-role="title">{{title}}</div>
				</td>
			</tr>
		{{/if}}
			<tr>
			<td class="{{classPrefix}}-body" data-role="body">
				<div data-role="content" class="{{classPrefix}}-content"></div>
			</td>
		</tr>
		{{if buttons}}
			<tr>
				<td class="{{classPrefix}}-footer" data-role="footer">
					<div class="{{classPrefix}}-operation" data-role="buttons">
						{{each buttons as btn i}}
							<div class="{{classPrefix}}-button-item">
								<a class="{{classPrefix}}-button {{btn.cls}}" data-role="{{btn.role}}" href="javascript:;">{{btn.text}}</a>
							</div>
						{{/each}}
					</div>
				</td>
			</tr>
		{{/if}}
	</table>
</div>