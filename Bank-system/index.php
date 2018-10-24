<!DOCTYPE html>
<html lang="en">

<head>
    <title>M-banking</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm"
        crossorigin="anonymous">
    <script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossorigin="anonymous"></script>
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js" integrity="sha384-JZR6Spejh4U02d8jOt6vLEHfe/JQGiRRSQQxSfFWpi1MquVdAyjUar5+76PVCmYl"
        crossorigin="anonymous"></script>
    <link rel="stylesheet" href="css/style.css">
    
</head>

<div class="jumbotron text-center">
    <h1>login to M-Bank </h1>
  </div>
<body>
    <div class="container">
        
        <!--img src="image/bk2.jpg" width=640px height=380px class="responsive"/-->
        
        <form action="signin.php" method="post" >
              
            <hr>
            <label for="bank code"><b>Account Number:</b></label>
            <input type="text" placeholder="enter account number " name="AccNo" required>
            <br><br>
            <label for="Pin"><b>pin:</b></label>
            <input type="password" placeholder="enter your pin" name="pin" required>
            <br><br>

            <hr>
            <button type="sign in" class="signinbtn">sign in</button>
        </form>

    <div>
        <!--<button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalLong">
            admin signin
        </button>
        <div class="modal fade" id="ModalLong" tabindex="-1" role="dialog" aria-labelledby="ModalLongTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalLongTitle">admin login to M-Bank </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form action="adminlogin.php" method="post">
                            <hr>
                            <label for="Name"><b>name:</b></label>
                            <input type="text" placeholder="enter the admin name" name="name" required>
                            <br><br>
                            <label for="Password"><b>Password:</b></label>
                            <input type="password" placeholder="enter the admin password " name="password" required>
                            <br><br>
                            <hr>
                            <button type="sign in" class="signinbtn">sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <button type="button" class="btn btn-primary" data-toggle="modal" data-target="#ModalLon">
            login clerk
        </button>
        <div class="modal fade" id="ModalLon" tabindex="-1" role="dialog" aria-labelledby="ModalLonTitle" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="ModalLonTitle">clerk login to M-Bank </h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form action="signincustcare.php" method="post">
                            <hr>
                            <label for="bank code"><b>Bank code:</b></label>
                            <input type="text" placeholder="enter the bank code" name="bkcode" required>
                            <br><br>
                            <label for="Password"><b>Password:</b></label>
                            <input type="password" placeholder="enter the clerk  password " name="password" required>
                            <br><br>
                            <hr>
                            <button type="sign in" class="signinbtn">sign in</button>
                        </form>
                    </div>
                </div>
            </div>-->
        </div>
    </div>
</body>
</html>