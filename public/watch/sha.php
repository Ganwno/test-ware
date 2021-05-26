<?php
    require('makePrivate.php');

    // echo a tickerList variable from blk file
    $fileContent = file_get_contents("../../privateData/YDRZC.blk");
    // make \r\n comma separated instead
    $fileContent = trim(preg_replace('/(\r\n)/',',',$fileContent));
    echo '<script type="text/javascript">';
    echo 'var tickerListRaw = "' . $fileContent . '";';
    echo '</script>';
?>

<!DOCTYPE html>
<html lang="en">
    <head>
      <meta charset="utf-8">
      <!-- Responsive viewport for mobile -->
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  
      <!-- Bootstrap CSS -->
      <!-- <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous"> -->

      <link rel="stylesheet" href="./watch-widget.css">
      <title>Sha-List</title>
    </head>
    <body>
      <div class="container" id="navbar-container"></div>

      <div id="quotes-container">
          <script type="text/javascript">

            var showNTickers = 16;

            for(let i = 0; i < showNTickers; i++){
                document.write(`
                    <div class="list-row">
                        <span class="ticker" id="ticker${i}">.</span>
                        <span class="price" id="price${i}">.</span>
                        <span class="chg" id="change${i}">.</span>
                    </div>
                `);
            }      
          </script>        
      </div>

      <script src="./content/js/jquery.min.js"></script>
      <script type="text/javascript" src="./watch-widget.js"></script>



      <script type="text/javascript">
        
        var tickerList = [];

        // get the tickerlist from blk file
        // var client = new XMLHttpRequest();
        // client.open('GET', './YDRZC.blk');
        // client.onreadystatechange = function() {
        //     if (this.readyState === 4 && this.status === 200) {
        //         let tempList = client.responseText.split("\r\n");
        //         tempList.forEach((element, index) => {
        //             if(element.length >2){
        //                 tickerList.push((element.substr(0,1) == '1'? 'sh' : 'sz') + element.substr(1));
        //             }
        //         }); 
        //         updatePriceData();  // call once immediately, then set interval for every n seconds
        //         setInterval(function(){
        //             updatePriceData();
        //         }, 5000);
                
        //     }
        // }
        // client.send();

        // new method to get tickerlist from blk file, tickerListRaw is loaded by php on page load
        // console.log(tickerListRaw);
        let tempList = tickerListRaw.split(",");
        tempList.forEach((element, index) => {
            if(element.length >2){
                tickerList.push((element.substr(0,1) == '1'? 'sh' : 'sz') + element.substr(1));
            }
        }); 
        updatePriceData();  // call once immediately, then set interval for every n seconds
        setInterval(function(){
            updatePriceData();
        }, 5000);

        // console.log(tickerList);

        function updatePriceData(){
            for(let i=0; i<showNTickers; i++){
                loadSinaJS(i, tickerList[i]);
            }
        }

        function loadSinaJS(index, ticker){

            // let script = document.createElement("script");
            // script.type = "text/javascript";
            // script.src = "http:\/\/hq.sinajs.cn\/list=" + ticker;
            // script.onload = function () {
            //     let currStock = "hq_str_" + ticker;
            //     let elements=window[currStock].split(",");
            //     // console.log(elements);
            //      elementsToHTML(index, elements);

            //     document.body.removeChild(script);
            // };
            // document.body.appendChild(script);

            // send the link to server php to get the data
            $.ajax({
                url: 'getSina.php',
                type: 'POST',
                data: function(){
                    // post ticker only
                    var data = new FormData();
                    data.append('ticker', ticker);
                    return data;
                }(),
                success: function(data){
                    let elements = data.split('"')[1].split(',');
                    elementsToHTML(index, elements);
                },
                error: function(e){
                    console.log(e);
                },
                complete: function(){
                    // console.log("completee");
                },
                cache: false,
                contentType: false,
                processData: false
            });

        }

        function elementsToHTML(index, elements){
            $('#ticker' + index).text(elements[0]);
            let tempPrice = 0;
            if(parseFloat(elements[3]) == 0.0){ tempPrice = parseFloat(elements[2]);  }else{  tempPrice = parseFloat(elements[3]);  }
            $('#price' + index).text(tempPrice);
            let tempChg = 0;
            if (parseFloat(elements[3]) == 0 || parseFloat(elements[2]) == 0){ tempChg = 0;}
            else{ tempChg = parseFloat(elements[3])/ parseFloat(elements[2]) - 1; } //当前价格 除以 昨日收盘 减1
            $('#change' + index).text((100*tempChg).toFixed(2) + "%");
            // set the class to show red and green colour
            if(tempChg > 0){
                $('#change' + index).attr('class', 'chg-positive');
            }else if(tempChg < 0){
                $('#change' + index).attr('class', 'chg-negative');
            }else{
                $('#change' + index).attr('class', 'chg');
            }
        }

      </script>

    </body>
</html>