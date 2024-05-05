resource "aws_instance" "spdr" {
  depends_on             = [aws_security_group.ec2_security_group]
  ami                    = "ami-0d940f23d527c3ab1"
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.ec2_security_group.id]
  count                  = 1
  tags                   = {
    Name          = "spdr"
    owner         = "ryan.blignaut@bbd.co.za"
    created-using = "terraform"
  }
}