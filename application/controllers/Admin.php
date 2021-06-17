<?php
defined('BASEPATH') OR exit('No direct script access allowed');
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
class Admin extends CI_Controller {
	public function __construct(){
		parent::__construct();
		$this->load->helper('url');
		$this->load->model('admin_model');
		$this->load->model('api_model');
		$this->load->library('Ssp');
		$this->load->library('mailer');
		$this->load->library('pdf');
		$this->load->library('pdf2');
	}
	public function index(){
        if($this->session->userdata('authenticated_admin')){
			$this->dashboard();
		}else{
			$this->login();
		}
	}
	public function dashboard(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{	
			$data['page'] = 'Dashboard';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/dashboard', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}
	public function login(){
		$this->load->view('Admin/login');
	}
	public function show_session(){
		$session = $this->session->all_userdata();
    	echo json_encode($session);
	}

	//-----------------------------------------------------------------------------DAERAH

	public function regencies(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Kabupaten';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/regencies', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}
	public function districts(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Kecamatan';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/districts', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}
	public function sub_districts(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Kelurahan';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/sub_districts', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	//---------------------------------------------------------------- NEWS

	public function news_categories(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Kategori Berita';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/news_categories', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	public function news(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Berita';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/list_news', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	public function popular_news(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Berita Populer';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/populars', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	public function users(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Pengguna';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/list_users', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	public function headline_news(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = 'Berita Headline';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/headline', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	public function details($v){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$decode = explode("/", base64_decode($v));
			$table = $decode[0];
			$id = $decode[1];
			switch($table){
				case 'users':
					$this->user_detail('users_complate_data', $id);
					break;
			}
		}
	}

	private function user_detail($table, $id){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$r = $this->api_model->get_data_by_where($table, array('id'=>$id))->result();
			// if(count($r) > 0){
				$data['regencies'] = $this->api_model->get_data_by_where('regencies', array('id>='=>'0', 'is_active'=>true))->result();
				$data['districts'] = $this->api_model->get_data_by_where('districts', array('regency_id'=>$r[0]->regency_id, 'is_active'=>true))->result();
				$data['sub_districts'] = $this->api_model->get_data_by_where('sub_districts', array('id>='=>'0', 'is_active'=>true))->result();
				$data['occupations'] = $this->api_model->get_data_by_where('occupations', array('id>='=>'0'))->result();
				$data['user'] = $r[0];
			// }
			$data['page'] = 'Pengguna';
			$data['session'] = $this->session->all_userdata();
			// echo json_encode($data);
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/user_detail', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}

	public function update_user_process(){
		$data = array(
			'name'=>$this->input->post('name'),
			'nik'=>$this->input->post('nik'),
			'community_unit'=>$this->input->post('community_unit'),
			'whatsapp_number'=>$this->input->post('whatsapp_number'),
			'sex'=>$this->input->post('sex'),
			'occupation_id'=>$this->input->post('occupation'),
			'sub_district_id'=>$this->input->post('sub_districts')
		);
		$where_clause = array('id'=>$this->input->post('id'));
		$table = 'users';
		if($this->api_model->update_data($where_clause, $table, $data)){
			$this->session->set_flashdata('msg_upload', 'Ubah data pengguna sukses');
			$this->message('Pengguna');
		}else{
			$this->session->set_flashdata('msg_upload', 'Ubah data pengguna gagal');
			$this->message('Pengguna');
		}
	}

	public function create_news(){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data = array(
				'is_active' => true,
			);
			$table = 'news_categories';
			$data['data'] = $this->api_model->get_data_by_where($table, $data)->result();
			$data['page'] = 'Buat Berita';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/add_news', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}
	public function update_news($x){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$v1 = base64_decode($x);
			$id = base64_decode($v1);
			$data['news_categories'] = $this->api_model->get_data_by_where('news_categories', array('is_active' => true))->result();
			$data['news'] = $this->api_model->get_data_by_where('news_complate_data', array('id'=>$id))->result();
			$data['news_photos'] = $this->api_model->custom_query("select * from news_photos where news_id = ".$id." order by created_at desc")->result();
			$data['page'] = 'Berita';
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/update_news', $data);
			$this->load->view('Admin/Template/footer', $data);
			// echo json_encode($data);
		}
	}
	public function update_news_process(){
		$file = $_FILES['file']['name'];
		$title = $this->input->post('title');
		$content = $this->input->post('content');
		$category = $this->input->post('category');
		$last_photo = $this->input->post('last_photo');
		$id = $this->input->post('id');
		$table = 'news';
		$data = array(
		  'title'=>$title,
		  'content'=>$content,
		  'category_id'=>$category
		);
		if($this->api_model->update_data(array('id'=>$id), $table, $data)){
			if($file != null){
				$remove_char = preg_replace("/[^a-zA-Z]/", "", $file);
				$filename = time().$remove_char.'.jpg';
				$location = "assets/images/news/".$filename;
				$photo_name = $filename;

				$table2 = 'news_photos';
				$data2 = array(
					'name'=>$filename,
					'news_id'=>$id
				);
				if($this->api_model->insert_data($table2, $data2)){
					if(move_uploaded_file($_FILES['file']['tmp_name'], $location)){
						unlink("assets/images/news/".$last_photo);
						$this->session->set_flashdata('msg_upload', 'Upload Sukses');
						$this->message('Berita', base_url('admin/news'), 'Kembali ke berita');
					}else{
						$this->session->set_flashdata('msg_upload', 'Gagal Upload');
						$this->message('Berita', base_url('admin/news'), 'Kembali ke berita');
					}
				}else{
					$this->session->set_flashdata('msg_upload', 'Gagal Input Gambar');
					$this->message('Berita', base_url('admin/news'), 'Kembali ke berita');
				}
			}else{
				$this->session->set_flashdata('msg_upload', 'Update berhasil');
		  		$this->message('Berita', base_url('admin/news'), 'Kembali ke berita');
			}
		}else{
		  $this->session->set_flashdata('msg_upload', 'Gagal update');
		  $this->message('Berita', base_url('admin/news'), 'Kembali ke berita');
		}
	}
	public function message($page_header, $url, $back_to){
		if(!$this->session->userdata('authenticated_admin')){
			$this->login();
		}else{
			$data['page'] = $page_header;
			$data['url'] = $url;
			$data['back_to'] = $back_to;
			$data['session'] = $this->session->all_userdata();
			$this->load->view('Admin/Template/header', $data);
			$this->load->view('Admin/message', $data);
			$this->load->view('Admin/Template/footer', $data);
		}
	}
	public function create_news_process(){
		$file = $_FILES['file']['name'];
		$remove_char = preg_replace("/[^a-zA-Z]/", "", $file);
		$filename = time().$remove_char.'.jpg';
		$location = "assets/images/news/".$filename;
		$title = $this->input->post('title');
		$content = $this->input->post('content');
		$category = $this->input->post('category');
		$photo_name = $filename;
		$table = 'news';
		$data = array(
		  'title'=>$title,
		  'content'=>$content,
		  'category_id'=>$category
		);
		if($this->api_model->insert_data($table, $data)){
		  $table2 = 'news_photos';
		  $data2 = array(
			'name'=>$filename,
			'news_id'=>$this->db->insert_id()
		  );
		  if($this->api_model->insert_data($table2, $data2)){
			if(move_uploaded_file($_FILES['file']['tmp_name'], $location)){
			  $this->session->set_flashdata('msg_upload', 'Berita ditambahkan');
			  $this->message('Buat Berita', base_url('admin/create_news'), 'Kembali ke buat berita');
			}else{
			  $this->session->set_flashdata('msg_upload', 'Gagal upload gambar');
			  $this->message('Buat Berita', base_url('admin/create_news'), 'Kembali ke buat berita');
			}
		  }else{
			$this->session->set_flashdata('msg_upload', 'Gagal input gambar');
			$this->message('Buat Berita', base_url('admin/create_news'), 'Kembali ke buat berita');
		  }
		}else{
		  $this->session->set_flashdata('msg_upload', 'Gagal input gambar');
		  $this->message('Buat Berita', base_url('admin/create_news'), 'Kembali ke buat berita');
		}
	}
}
