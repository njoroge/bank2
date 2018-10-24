<?php 
  session_start();
require '../dbconn.php';
require ('fpdf.php');
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
    $this->Cell(30,10,'bank statement',0,0,'C');
    // Line break
    $this->Ln(20);
}

// Page footer
function Footer()
{
    // Position at 1.5 cm from bottom
    $this->SetY(-15);
    // Arial italic 8
    $this->SetFont('Times','I',8);
    // Page number
    $this->Cell(0,10,'Page '.$this->PageNo().'/{nb}',0,0,'C');
}
}
    $account = $_POST['accno'];
    $dsfs = $_POST['date1'];
    $st_date  =  date_format(date_create($dsfs), 'Y-m-d');
    $en_date  = date("Y-m-d", strtotime($_POST['date2']));  


$display_heading = array ( 'id'=>'Transaction id','AccNo'=>'account number', 'date'=>'transaction date','amount'=>'amount deposited', 'balance'=>'account balance' );
 
$sqli="SELECT *from transactions where AccNo = '$account' AND date BETWEEN '$st_date' AND '$en_date' ";

$result1= mysqli_query($conn, $sqli);
//echo $sqli;
$res2 = json_encode($result1);
$pdf = new PDF();
$pdf->AliasNbPages();
$pdf->AddPage();
$pdf->SetFont('Times','',12);
//echo $res2;
foreach ($display_heading as $heading){
    $pdf->Cell(40,12,$heading,1);
}
$data4 = array();
while ($row = $result1->fetch_assoc())
 {
    $data4[] = $row;
    //$pdf->Cell(40,12,$row['date'],1);
 }

foreach($data4 as $key => $value){
    $pdf->Cell(40,12,$value['id'],1);
    $pdf->Cell(40,12,$value['AccNo'],1);
    $pdf->Cell(40,12,$value['date'],1);
    $pdf->Cell(40,12,$value['amount'],1);
    $pdf->Cell(40,12,$value['balance'],1,1);
}
$pdf->Output();
?>