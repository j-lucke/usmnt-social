const { TwitterApi } = require('twitter-api-v2');
const client = new TwitterApi('AAAAAAAAAAAAAAAAAAAAAMFclQEAAAAAvDjanDNrB4307fft9tC%2FtkD38Uo%3DCgmGJ9M6tGyBXc1TcUMeamrnFNdjnMEGCVKyFlzHfVKmljo3wO');
const usmnt = require('knex')({
  client: 'pg',
  connection: {
    host : 'dpg-cf9uvvarrk01l41mmnk0-a',
    port : 5432,
    user : 'jlucke',
    password : 'dIrzm6iSReSRYWjtFrYaOYRK12fUfUYf',
    database : 'usmnt'
  },
  useNullAsDefault: true
});

let column_name = '';

function createColumnName() {
	const now = new Date();
	return (
		now.getFullYear() + '-' + 
		now.getMonth() + '-' +
	  now.getDate() + '-' +
		now.getHours() + '-' + 
		now.getMinutes()
	);
}

function updateRecords(players){
	players.forEach( player => {
		if (player.twitter_name != null) {
			const str = 'users/by/username/' + player.twitter_name + '?user.fields=public_metrics';
			client.v2.get(str).then( twitter_user => {
				usmnt('twitter_followers')
					.where({id: player.id})
					.update(column_name, twitter_user.data.public_metrics.followers_count)
					.then();
				usmnt('twitter_followers')
					.where({id: player.id})
					.update({current_count: twitter_user.data.public_metrics.followers_count})
					.then();
			});
		}
	});
}

function getTwitterUpdate() {
	column_name = createColumnName();
	usmnt.schema.table('twitter_followers', (table) => {
		table.integer(column_name);
	}).then();
	usmnt.select('*').from('twitter_followers').then(updateRecords);
}

//----------------------------------------------------------------------------------
//----------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------

getTwitterUpdate();
setTimeout(() => {usmnt.destroy()}, 10000);


