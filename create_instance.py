import boto3
import os

key_id = os.getenv('AWS_ID')
access_id = os.getenv('AWS_SECRET')

ec2 = boto3.resource(
	'ec2',
	aws_access_key_id = key_id,
	aws_secret_access_key = access_id,
	region_name = 'us-east-2')

def create_keypair(ec2):
	keypair = ec2.create_key_pair(KeyName = 'haopengkey')
	with open('haopengkey.pem', 'w+') as f:
		f.write(keypair.key_material)
create_keypair(ec2)

mygroup = ec2.create_security_group(GroupName = 'my_sec_group', 
				    Description = 'A new security group')
ip_ranges = [{'CidrIp': '0.0.0.0/0'}]
ip_v6_ranges = [{'CidrIpv6': '::/0'}]
permissions = [{
        	'IpProtocol': 'TCP',
        	'FromPort': 22,
        	'ToPort': 22,
        	'IpRanges': ip_ranges,
        	'Ipv6Ranges': ip_v6_ranges
    }]
mygroup.authorize_ingress(IpPermissions=permissions)

deploy = ec2.create_instances(
	ImageId = 'ami-0b59bfac6be064b78',
	MinCount = 1,
        MaxCount = 1,
        InstanceType = 't2.micro',
        SecurityGroups = ['my_sec_group'],
        KeyName = 'haopengkey'
    )


def region():
    my_session = boto3.session.Session()
    my_region = my_session.region_name
    return my_region
#print(region())

def id(instance):
    return instance.id
#print(id(my_instance))

def ip(instance):
    return instance.public_ip_address
#print(id(my_instance))

#ids = [id(my_instance)]
def stop(ids):
    ec2.instances.filter(InstanceIds=ids).stop()

def terminate(ids):
    ec2.instances.filter(InstanceIds=ids).terminate()
