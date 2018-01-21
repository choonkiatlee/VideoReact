document.getElementById('user_id1').textContent = json.user_name['0'];
document.getElementById('profile_pic1').src = json.profile_pic['0'];
document.getElementById('text1').textContent = json.text['0'];
document.getElementById('created_at1').textContent=json.created_at['0'];
document.getElementById('retweet1').textContent=json.RT['0'];
document.getElementById('favourite1').textContent=json.favourites['0'];

document.getElementById('user_id2').textContent = json.user_name['1'];
document.getElementById('profile_pic2').src = json.profile_pic['1'];
document.getElementById('text2').textContent = json.text['1'];
document.getElementById('created_at2').textContent=json.created_at['1'];
document.getElementById('retweet2').textContent=json.RT['1'];
document.getElementById('favourite2').textContent=json.favourites['1'];

document.getElementById('user_id3').textContent = json.user_name['2'];
document.getElementById('profile_pic3').src = json.profile_pic['2'];
document.getElementById('text3').textContent = json.text['2'];
document.getElementById('created_at3').textContent=json.created_at['2'];
document.getElementById('retweet3').textContent=json.RT['2'];
document.getElementById('favourite3').textContent=json.favourites['2'];

document.getElementById('user_id4').textContent = json.user_name['3'];
document.getElementById('profile_pic4').src = json.profile_pic['3'];
document.getElementById('text4').textContent = json.text['3'];
document.getElementById('created_at4').textContent=json.created_at['3'];
document.getElementById('retweet4').textContent=json.RT['3'];
document.getElementById('favourite4').textContent=json.favourites['3'];

document.getElementById('user_id5').textContent = json.user_name['4'];
document.getElementById('profile_pic5').src = json.profile_pic['4'];
document.getElementById('text5').textContent = json.text['4'];
document.getElementById('created_at5').textContent=json.created_at['4'];
document.getElementById('retweet5').textContent=json.RT['4'];
document.getElementById('favourite5').textContent=json.favourites['4'];

function reviseCoefficient(){
    tweet_coeff1 = document.getElementById('tweet_coeff1').value;
    tweet_coeff2 = document.getElementById('tweet_coeff2').value;
    //tweet_coeff3 = document.getElementById('tweet_coeff3').value;
    
    tweetCoefs[0] = parseFloat(tweet_coeff1);
    tweetCoefs[1] = parseFloat(tweet_coeff2);
    //tweetCoefs[2] = parseFloat(tweet_coeff3);
    
    fav_coeff1 = document.getElementById('fav_coeff1').value;
    fav_coeff2 = document.getElementById('fav_coeff2').value;
    //fav_coeff3 = document.getElementById('fav_coeff3').value
    
    favCoefs[0] = parseFloat(fav_coeff1);
    favCoefs[1] = parseFloat(fav_coeff2);
    //favCoefs[2] = parseInt(fav_coeff3);
    
    RT_coeff1 = document.getElementById('RT_coeff1').value;
    RT_coeff2 = document.getElementById('RT_coeff2').value;
    //RT_coeff3 = document.getElementById('RT_coeff3').value;
    
    retweetCoefs[0] = parseFloat(RT_coeff1);
    retweetCoefs[1] = parseFloat(RT_coeff2);
    //retweetCoefs[2] = parseInt(RT_coeff3);
    
    offset = document.getElementById('offset').value;
    indicatorOffset = parseFloat(offset);
    
    updateIndicator();

}