jQuery(function() {
	initPopups();
	initModals();
});

function initPopups() {
	var activeClass = 'popup-active';
	var openedClass = 'opened';
	var content = jQuery('.content');
	var contentBlock = jQuery('.content-holder');
	var animSpeed = 300;

	jQuery('.popup-opener').each(function() {
		var opener = jQuery(this);
		var target = jQuery(opener.attr('href'));

		opener.on('click', function(e) {
			e.preventDefault();
			if (target.hasClass(activeClass)) {
				target.removeClass(activeClass);
				opener.removeClass(openedClass);

				contentBlock.stop().animate({
					'marginBottom': 0
				}, animSpeed);
				content.stop().animate({
					'marginBottom': 0
				}, animSpeed);
			} else {
				target.addClass(activeClass);
				opener.addClass(openedClass);

				contentBlock.stop().animate({
					'marginBottom': -1 * calcHeight(target)
				}, animSpeed);
				content.stop().animate({
					'marginBottom': calcHeight(target)
				}, animSpeed);
			}
		});
	});
	
	function calcHeight(block) {
		var blockHeight = block.innerHeight();
		return blockHeight;
	}
}

function initModals() {
	var activeClass = 'modal-active';
	var openedClass = 'opened';

	jQuery('.modal-opener').each(function() {
		var opener = jQuery(this);
		var target = jQuery(opener.attr('href'));

		opener.on('click', function(e) {
			e.preventDefault();
			target.toggleClass(activeClass);
			opener.toggleClass(openedClass);
		});
	});
}