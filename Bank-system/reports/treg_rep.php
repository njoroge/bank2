<?php
require('fpdf.php');
include_once '../dbconn.php';
class PDF extends FPDF
{
// Page header
function Header()
{
    // Logo
    $this->Image('../image/bk2.jpg',10,6,30);
    // Arial bold 15
    $this->SetFont('Times','B',15);
    // Move to the right
    $this->Cell(80);
    // Title
    $this->Cell(30,10,'registered tellers',0,0,'C');
    // Line break
    $this->Ln(20);
}
// Page footer
function Footer()
{
    // Position at 1.5 cm from bottom
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Arial','I',8);
    // Page number
    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
}
}

$dsfs = $_POST['date1'];
    $st_date  =  date_format(date_create($dsfs), 'Y-m-d');
    $en_date  = date("Y-m-d", strtotime($_POST['date2']));  


$display_heading = array ( 'fname'=>'First Name','lname'=>'Last Name', 'AccNo'=>'Account Number', 'date'=>'Date created'); 
 
$sqli="SELECT fname,lname,AccNo,is_customer,date from users where  is_teller= 1 and date BETWEEN '$st_date' AND '$en_date' " ;

$result1= mysqli_query($conn, $sqli);
//echo $sqli;
$res2 = json_encode($result1);
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Times','',12);

foreach ($display_heading as $heading){
    $pdf->Cell(40,12,$heading,1);
    
}
$pdf->Ln();
$data6 = array();
while ($row = $result1->fetch_assoc())
 {
    $data6[] = $row;
    //$pdf->Cell(40,12,$row['date'],1);
 }

foreach($data6 as $key => $value){
    $pdf->Cell(40,12,$value['fname'],1);
    $pdf->Cell(40,12,$value['lname'],1);
    $pdf->Cell(40,12,$value['AccNo'],1);
    $pdf->Cell(40,12,$value['date'],1,1);
    
}
$pdf->Output();
?>