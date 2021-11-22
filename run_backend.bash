run=$1

cd backend

mkvirtualenv --python=$(which python3.8) tp-venv
workon tp-venv

pip3 install -r requirements.txt

python3 manage.py makemigrations backend
python3 manage.py migrate

if [[ ! -z "$run" && "$run" == "y" ]]; then
	python3 manage.py runserver localhost:8000
fi

cd ..