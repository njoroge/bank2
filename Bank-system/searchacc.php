

<?php
session_start();
include_once 'dbconn.php';
if(isset($_REQUEST["term"])){
    
    $sql = "SELECT * FROM users WHERE AccNo LIKE ?";
    
    if($stmt = $conn->prepare($sql)){
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param("s", $param_term);
        
        // Set parameters
        $param_term = $_REQUEST["term"] . '%';
        
        // Attempt to execute the prepared statement
        if($stmt->execute()){
            $result = $stmt->get_result();
            
            // Check number of rows in the result set
            if($result->num_rows > 0){
                // Fetch result rows as an associative array
                while($row = $result->fetch_array(MYSQLI_ASSOC)){
                    echo "<p>" . $row["AccNo"] . "</p>";
                }
            } else{
                echo "<p>No matches found</p>";
            }
        } else{
            echo "ERROR: Could not  execute $sql. " . mysqli_error($link);
        }
    }
     
    // Close statement
    $stmt->close();
}
 


?>