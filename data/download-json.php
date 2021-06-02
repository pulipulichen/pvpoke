<?php

file_put_contents('../src/data/gamemaster.json', file_get_contents('https://github.com/pvpoke/pvpoke/raw/master/src/data/gamemaster.json'));
file_put_contents('../iv/data/pvpoke.tw/gamemaster.json', file_get_contents('https://pvpoketw.com/data/gamemaster.json'));

file_put_contents('../src/data/all/overall/rankings-1500.json', file_get_contents('https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-1500.json'));
file_put_contents('../src/data/all/overall/rankings-2500.json', file_get_contents('https://raw.githubusercontent.com/pvpoke/pvpoke/master/src/data/rankings/all/overall/rankings-2500.json'));


$date = date("yyyy-mm-dd", strtotime(now));
file_put_contents('./update-date.txt', $date);

?>
OK