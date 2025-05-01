import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './post.css';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import NavBar from '../../Components/NavBar/NavBar';
import { HiCalendarDateRange } from "react-icons/hi2";

function AllLearningPlan() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchOwnerName, setSearchOwnerName] = useState('');
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningPlan');
        setPosts(response.data);
        setFilteredPosts(response.data); // Initially show all posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Ensure this runs only once on component mount

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningPlan/${id}`);
        alert('Post deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id)); // Update the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/updateLearningPlan/${id}`;
  };

  const renderPostByTemplate = (post) => {
    console.log('Rendering post:', post); // Debugging: Log the post object
    if (!post.templateID) { // Use the correct field name
      console.warn('Missing templateID for post:', post); // Warn if templateID is missing
      return <div className="template template-default">Invalid template ID</div>;
    }

    switch (post.templateID) { // Use the correct field name
      case 1:
        return (
          <div className="template_dis template-1">
            <div className='user_details_card' style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px'
            }}>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    margin: 0
                  }}>{post.postOwnerName}</p>
                </div>
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post' style={{ display: 'flex', gap: '15px' }}>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon'
                    style={{
                      color: '#4285F4',
                      cursor: 'pointer',
                      fontSize: '38px', // Increased from 28px to 38px
                      transition: 'transform 0.2s',
                      padding: '6px', // Reduced from 15px to 6px
                      borderRadius: '50%',
                      backgroundColor: 'rgba(66, 133, 244, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{
                      color: '#FF6F61',
                      cursor: 'pointer',
                      fontSize: '38px', // Increased from 28px to 38px
                      transition: 'transform 0.2s',
                      padding: '6px', // Reduced from 15px to 6px
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 111, 97, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}
            </div>
            <p className='template_title' style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>{post.title}</p>
            <p className='template_dates' style={{ 
              color: '#555',
              fontSize: '16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ 
              color: '#4285F4',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              padding: '5px 10px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ 
              whiteSpace: "pre-line",
              color: '#555',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>{post.description}</p>
            <div className="tags_preview" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>#{tag}</span>
              ))}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  marginTop: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  maxHeight: '400px',
                  objectFit: 'contain'
                }}
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  marginTop: '10px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              ></iframe>
            )}
          </div>
        );
      case 2:
        return (
          <div className="template_dis template-2">
            <div className='user_details_card' style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px'
            }}>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    margin: 0
                  }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post' style={{ display: 'flex', gap: '15px' }}>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon'
                    style={{
                      color: '#4285F4',
                      cursor: 'pointer',
                      fontSize: '38px', // Increased from 28px to 38px
                      transition: 'transform 0.2s',
                      padding: '6px', // Reduced from 15px to 6px
                      borderRadius: '50%',
                      backgroundColor: 'rgba(66, 133, 244, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{
                      color: '#FF6F61',
                      cursor: 'pointer',
                      fontSize: '38px', // Increased from 28px to 38px
                      transition: 'transform 0.2s',
                      padding: '6px', // Reduced from 15px to 6px
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 111, 97, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}
            </div>
            <p className='template_title' style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>{post.title}</p>
            <p className='template_dates' style={{ 
              color: '#555',
              fontSize: '16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ 
              color: '#4285F4',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              padding: '5px 10px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ 
              whiteSpace: "pre-line",
              color: '#555',
              fontSize: '16px',
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>{post.description}</p>
            <div className="tags_preview" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>#{tag}</span>
              ))}
            </div>
            <div className='preview_part' style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '15px',
              marginTop: '15px'
            }}>
              <div className='preview_part_sub'>
                {post.imageUrl && (
                  <img
                    src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                    alt={post.title}
                    className="iframe_preview"
                    style={{
                      width: '100%',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </div>
              <div className='preview_part_sub'>
                {post.contentURL && (
                  <iframe
                    src={getEmbedURL(post.contentURL)}
                    title={post.title}
                    className="iframe_preview"
                    frameBorder="0"
                    allowFullScreen
                    style={{
                      width: '100%',
                      height: '100%',
                      minHeight: '250px',
                      borderRadius: '8px',
                      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                    }}
                  ></iframe>
                )}
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="template_dis template-3">
            <div className='user_details_card' style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '15px',
              borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
              paddingBottom: '10px'
            }}>
              <div>
                <div className='name_section_post'>
                  <p className='name_section_post_owner_name' style={{ 
                    fontWeight: 'bold', 
                    color: '#333',
                    margin: 0
                  }}>{post.postOwnerName}</p>
                </div>
                
              </div>
              {post.postOwnerID === localStorage.getItem('userID') && (
                <div className='action_btn_icon_post' style={{ display: 'flex', gap: '15px' }}>
                  <FaEdit
                    onClick={() => handleUpdate(post.id)} 
                    className='action_btn_icon'
                    style={{
                      color: '#4285F4',
                      cursor: 'pointer',
                      fontSize: '38px', // Increased from 28px to 38px
                      transition: 'transform 0.2s',
                      padding: '6px', // Reduced from 15px to 6px
                      borderRadius: '50%',
                      backgroundColor: 'rgba(66, 133, 244, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                  <RiDeleteBin6Fill
                    onClick={() => handleDelete(post.id)}
                    className='action_btn_icon'
                    style={{
                      color: '#FF6F61',
                      cursor: 'pointer',
                      fontSize: '38px', // Increased from 28px to 38px
                      transition: 'transform 0.2s',
                      padding: '6px', // Reduced from 15px to 6px
                      borderRadius: '50%',
                      backgroundColor: 'rgba(255, 111, 97, 0.1)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.2)';
                      e.target.style.transform = 'scale(1.1)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(255, 111, 97, 0.1)';
                      e.target.style.transform = 'scale(1)';
                    }}
                  />
                </div>
              )}
            </div>
            {post.imageUrl && (
              <img
                src={`http://localhost:8080/learningPlan/planImages/${post.imageUrl}`}
                alt={post.title}
                className="iframe_preview_dis"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  maxHeight: '350px',
                }}
              />
            )}
            {post.contentURL && (
              <iframe
                src={getEmbedURL(post.contentURL)}
                title={post.title}
                className="iframe_preview_dis"
                frameBorder="0"
                allowFullScreen
                style={{
                  width: '100%',
                  height: '300px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                }}
              ></iframe>
            )}
            <p className='template_title' style={{ 
              color: '#333', 
              fontSize: '22px', 
              fontWeight: 'bold',
              marginBottom: '10px'
            }}>{post.title}</p>
            <p className='template_dates' style={{ 
              color: '#555',
              fontSize: '16px',
              marginBottom: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}><HiCalendarDateRange /> {post.startDate} to {post.endDate} </p>
            <p className='template_description' style={{ 
              color: '#4285F4',
              fontSize: '14px',
              fontWeight: 'bold',
              backgroundColor: 'rgba(66, 133, 244, 0.1)',
              padding: '5px 10px',
              borderRadius: '15px',
              display: 'inline-block'
            }}>{post.category}</p>
            <hr></hr>
            <p className='template_description' style={{ 
              whiteSpace: "pre-line",
              color: '#555',
              fontSize: '16px', //fontsize
              lineHeight: '1.6',
              marginBottom: '10px'
            }}>{post.description}</p>
            <div className="tags_preview" style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '5px',
              marginBottom: '15px'
            }}>
              {post.tags?.map((tag, index) => (
                <span key={index} className="tagname" style={{
                  backgroundColor: 'rgba(66, 133, 244, 0.1)',
                  color: '#4285F4',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '13px'
                }}>#{tag}</span>
              ))}
            </div>
          </div>
        );
      default:
        console.warn('Unknown templateID:', post.templateID); // Warn if templateID is unexpected
        return (
          <div className="template template-default">
            <p>Unknown template ID: {post.templateID}</p>
          </div>
        );
    }
  };

  return (
    <div>
      <div className='continer' style={{ 
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#0a1f44',
        paddingBottom: '50px',
        paddingTop: '20px'
      }}>
        <div style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          background: 'linear-gradient(135deg, rgba(6, 118, 120, 0.7), rgba(8, 8, 77, 0.8))', 
          zIndex: 1 
        }}></div>
        
        <NavBar />
        
        <div className='continSection' style={{ 
          position: 'relative',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '20px auto',
          padding: '0 15px',
          marginTop: '80px',
        }}>
          <div className='searchinput' style={{ 
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center',
            width: '100%'
          }}>
            <input
              type="text"
              placeholder="Search by owner name"
              value={searchOwnerName}
              onChange={(e) => {
                const value = e.target.value;
                setSearchOwnerName(value);
                setFilteredPosts(
                  posts.filter((post) =>
                    post.postOwnerName.toLowerCase().includes(value.toLowerCase())
                  )
                );
              }}
              className="Auth_input"
              style={{ 
                width: '70%', 
                padding: '12px', 
                borderRadius: '30px', 
                border: '1px solid #ccc', 
                fontSize: '16px', 
                boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.1)',
                textAlign: 'center'
              }}
            />
          </div>
          <div className='add_new_btn' 
            onClick={() => (window.location.href = '/addLearningPlan')}
            style={{
              backgroundColor: '#FF6F61',
              color: '#fff',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 0 20px auto',
              boxShadow: '0 4px 12px rgba(255, 111, 97, 0.3)',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = '#E64A45';
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 14px rgba(255, 111, 97, 0.4)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#FF6F61';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(255, 111, 97, 0.3)';
            }}
          >
            <IoIosCreate className='add_new_btn_icon' style={{ fontSize: '24px' }}/>
          </div>
          <div className='post_card_continer'>
            {filteredPosts.length === 0 ? (
              <div className='not_found_box' style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '15px',
                padding: '30px',
                boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                margin: '40px auto',
                maxWidth: '500px'
              }}>
                <div className='not_found_img'></div>
                <p className='not_found_msg' style={{ color: '#555', fontSize: '18px', margin: '20px 0' }}>No posts found. Please create a new post.</p>
                <button 
                  className='not_found_btn' 
                  onClick={() => (window.location.href = '/addLearningPlan')}
                  style={{
                    backgroundColor: '#4285F4',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px 25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 8px rgba(66, 133, 244, 0.3)'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#3367D6';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 14px rgba(66, 133, 244, 0.4)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = '#4285F4';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 8px rgba(66, 133, 244, 0.3)';
                  }}
                >Create New Post</button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className='post_card_new' style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  borderRadius: '15px',
                  padding: '25px',
                  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                  marginBottom: '30px',
                  transition: 'transform 0.3s, box-shadow 0.3s'
                }}>
                  {renderPostByTemplate(post)}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllLearningPlan;