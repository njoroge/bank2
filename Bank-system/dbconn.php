<?php
$conn=mysqli_connect("localhost","root","","banking");
// Check connection
if(! $conn ){
    die('Could not connect: ' . mysqli_error());
 
 }
 mysqli_select_db($conn,"banking");
 //mysqli_close($conn);