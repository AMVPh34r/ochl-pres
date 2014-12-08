// Constructor
var app = app || {};

// Variables
app.videoDone = false;
app.slideColors = ['#03899C', '#00B945', '#FF7A00', '#1144AA', 
				   '#FF9700', '#00B945', '#03899C', '#1144AA'];

// Functions
app.goToByScroll = function(id) {
	$('html,body').animate({
		scrollTop: $(id).offset().top
	}, 'slow');
};

app.setSlideBgs = function(colors) {
	var slides = $('.slide');
	for (i=0; i<slides.length; i++) {
		var slide = $(slides[i])
		if (slide.attr('data-bg') !== undefined) {
			slide.css('background-color', slide.attr('data-bg'));
		} else {
			slide.css('background-color', colors[i]);
		}
	}
}

app.run = function() {
	// Immediately pause all but first video
	$('.mainvideo').not('.mainvideo-first').get(0).pause();

	// Set slide background colors
	app.setSlideBgs(app.slideColors);

	$('.mainvideo').on('ended click', function() {
		// Skip to the next video if it exists when the video is finished or clicked
		var vid = $(this);

		if (vid.attr('data-next') !== undefined) {
			vid.hide();
			$(vid.attr('data-next')).show().get(0).play();
		} else {
			app.videoDone = true;
		}
	});

	$(document).on('click', '.slide', function() {
		// When a slide is clicked, move to the next one if it exists
		var slide = $(this);
		var nextSlide = slide.attr('data-next');

		if ((app.videoDone === true) && (nextSlide !== undefined)) {
			app.goToByScroll(nextSlide);
		}
	});
};

$(document).ready(app.run);