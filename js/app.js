$(document).ready(function() {
	document.addEventListener('deviceready', onDeviceReady(), false);
});

function onDeviceReady() {
	//Check localStorage for Channel
	if (localStorage.channel == null || localStorage.channel == '') {
		$('#popupDialog').popup('open');
	}else{
		var channel = localStorage.getItem('channel');
	}
	//var channel = 'TechGuyWeb';

	getPlaylist(channel);

	$(document).on('click', '.vid-list li', function(){
		showVideo($(this).attr('videoId'));
	})
	$('#channelBtnOK').click(function(){
		var channel = $('#channelName').val();
		setChannel(channel);
		getPlaylist(channel);
	});
	$('#saveOptions').click(function(){
		saveOptions()
	});
	$('#clearChannel').click(function(){
		clearChannel()
	});
	$(document).on('pageinit', '#options', function(event){
		var channel = localStorage.getItem('channel')
		var maxResults = localStorage.getItem('maxResults')
		$('#channelNameOptions').attr('value', channel)
		$('#maxResultsOptions').attr('value', maxResults)	
	})
}

function getPlaylist(channel) {
	$('.vid-list').html('');
	$.get(
			"https://www.googleapis.com/youtube/v3/channels", 
			{
				part: 'contentDetails',
				forUsername: channel,
				key: 'AIzaSyC0Tg8VDGNNDaqr3WIKTuHyrHkLJUK0wDo'
			},
			function(data){
				$.each(data.items, function(i, item){
					console.log(item);
					playListId = item.contentDetails.relatedPlaylists.uploads;
					getVideos(playListId, localStorage.getItem('maxResults'))
				})
			}
		)
}

function getVideos(playListId, maxResults) {
	$.get(
		"https://www.googleapis.com/youtube/v3/playlistItems",
		{
			part: 'snippet',
			maxResults: maxResults,
			playlistId: playListId,
			key: 'AIzaSyC0Tg8VDGNNDaqr3WIKTuHyrHkLJUK0wDo'
		},
		function(data){
			var output;
			$.each(data.items, function(i, item){
				id = item.snippet.resourceId.videoId;
				title = item.snippet.title;
				thumb = item.snippet.thumbnails.default.url;
				$('.vid-list').append('<li videoId="' + id + '"><img src="'+thumb+'"><h3>'+ title +'</h3></li>' );
				$('.vid-list').listview('refresh');
			})
		}
	)
}

function showVideo(vId) {
	console.log('Showing video: ' + vId);
	$('#logo').hide();
	var output = '<iframe width="100%" height="250" src="https://www.youtube.com/embed/'+vId+'" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	$('#show-video').html(output)
}

function setChannel(channel){
	localStorage.setItem('channel', channel );
}
function setMaxResults(maxResults){
	localStorage.setItem('maxResults', maxResults );
}

function saveOptions() {
	var channel = $('#channelNameOptions').val()
	setChannel(channel)
	var maxResults = $('#maxResultsOptions').val()
	setMaxResults(maxResults);
	$('body').pagecontainer('change', '#main', {options})
	getPlaylist(channel);
}

function clearChannel() {
	localStorage.removeItem('channel')
	$('body').pagecontainer('change', '#main', {options})
	$('.vid-list').html('')
	$('#popupDialog').popup('open');
}