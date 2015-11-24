;(function (window) {
	var node;
	$('#doc-content').find('h1,h2').each(function () {
		var tag = this.tagName.toLowerCase(),
			href = $('a',this).attr('href'),
			title = $(this).clone().children().remove().end().text();

		if (tag == 'h1') {
			node = $('<li><a href="'+href+'">'+title+'</a><ul class="nav"></ul></li>');
			$('#doc-nav > ul').append(node);
			node = node.find('.nav');
		} else if (node) {
			node.append('<li><a href="'+href+'">'+title+'</a></li>');
		}
	});

	$('body').scrollspy({ target: '#doc-nav' });
})(window);