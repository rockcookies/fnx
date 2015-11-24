<div class="<%=classPrefix%>-wrapper">
	<div class="<%=classPrefix%> {{skin}}">
		<a class="<%=classPrefix%>-close" title="Close" href="javascript:;" data-role="close">×</a>
		<table class="<%=classPrefix%>-grid">
			<%if (title) {%>
				<tr>
					<td class="<%=classPrefix%>-header" data-role="header">
						<div class="<%=classPrefix%>-title" data-role="title"><%=title%></div>
					</td>
				</tr>
			<%}%>

			<tr>
				<td class="<%=classPrefix%>-body" data-role="body">
					<div data-role="content" class="<%=classPrefix%>-content"></div>
				</td>
			</tr>

			<%if (buttons && buttons.length > 0) {%>
				<tr>
					<td class="<%=classPrefix%>-footer" data-role="footer">
						<div class="<%=classPrefix%>-operation" data-role="buttons">
							<%for (var i=0;i<buttons.length;i++) { var btn = buttons[i];%>
								<button type="button" class="<%=classPrefix%>-button {{btn.cls}}" <%if (btn.autofocus){%>autofocus<%}%> data-role="operation-<%=btn.role%>"><%=btn.text%></button>
							<%}%>
						</div>
					</td>
				</tr>
			<%}%>
		</table>
	</div>
</div>