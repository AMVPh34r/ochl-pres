// Constructor
var app = app || {};

// Variables
app.videoDone = false;
app.slideColors = ['#03899C', '#00B945', '#FF7A00', '#1144AA', 
				   '#FF9700', '#00B945', '#03899C', '#1144AA'];
app.currentSlide = 1;

// Functions
app.goToByScroll = function(id) {
	$('html,body').animate({
		scrollTop: $(id).offset().top
	}, 'slow');
};

app.toSlide = function(id) {
	var index = parseInt(id.substring(id.indexOf('-')+1));

	$(id).addClass('slide-show');
	if (index < app.currentSlide) {
		setTimeout(function() {
			$('.slide').not(id).removeClass('slide-show');
		}, 500);
	}
	app.currentSlide = parseInt($(id).attr('data-slide'));
}

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
			// app.goToByScroll(nextSlide);
			// $(nextSlide).addClass('slide-show');
			app.toSlide(nextSlide);
		}
	}).on('keydown', function(e) {
		// When a key is pressed, perform a specific action
		console.log(e.keyCode);
	});

};

$(document).ready(app.run);