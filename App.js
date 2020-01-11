import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableHighlight, Modal } from 'react-native';

export default function App() {
	//const apiurl = "https://api.themoviedb.org/3/movie/550?api_key=b352acb03b406d4d28f615f20639cdc6"
	const apiurl = "http://www.omdbapi.com/?apikey=dfe6d885"
	const [state, setState] = useState({
		s: "Enter a movie...",
		results: [],
		selected: {}
	})

	const search = () => {
		axios(apiurl + "&s=" + state.s).then(({ data }) => {
		let results = data.Search
		setState(prevState => {
			return { ...prevState, results: results }
		})
		})
	}

	const openPopup = id => {
		axios(apiurl + "&i=" + id).then(({ data }) => {
			let result = data;

			setState(prevState => {
				return { ...prevState, selected: result}
			})
		})
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Movie DB</Text>
			<TextInput 
				style={styles.searchbox}
				onChangeText={text => setState(prevState => {
				return {...prevState, s: text}
				})}
				onSubmitEditing={search}
				value={styles.s}
			/>

			<ScrollView style={styles.results}>
				{state.results.map(result => (
					<TouchableHighlight 
						key={result.imdbID} 
						onPress={() => openPopup(result.imdbID)
					}>
						<View style={styles.results}>
							<Image 
								source={{ uri: result.Poster}}
								style={{
									width: '100%',
									height: 300
								}}
								resizeMode="cover"
							/>
							<Text style={styles.heading}>{result.Title}</Text>
						</View>
					</TouchableHighlight>
				))}
			</ScrollView>

			<Modal
				animationType="fade"
				transparent={false}
				visible={(typeof state.selected.Title != "undefined")}
			>
				<View style={styles.popup}>
					<Text style={styles.poptitle}> {state.selected.Title} </Text>
					<Text style={{marginBottom: 20}}>Rating: {state.selected.imdbRating} </Text>
					<Text>{state.selected.Plot}</Text>			
				</View>
				<TouchableHighlight
					onPress={() => setState(prevState => {
						return { ...prevState, selected: {} }
					})}
				>
					<Text style={styles.closeBtn}>Close</Text>
				</TouchableHighlight>
			</Modal>
		</View>
	);
	}

	const styles = StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: '#223343',
			alignItems: 'center',
			justifyContent: 'flex-start',
			paddingTop: 70,
			paddingHorizontal: 20
		},
		title: {
			color: '#FFF',
			fontSize: 32,
			fontWeight: '700',
			textAlign: 'center',
			marginBottom: 20
		},
		searchbox: {
			fontSize: 20,
			fontWeight: '300',
			padding: 20,
			width: '100%',
			backgroundColor: '#FFF',
			borderRadius: 8,
			marginBottom: 40
		}, 
		results: {
			flex: 1,
			width: '100%',
			marginBottom: 20
		},
		heading: {
			color: '#FFF',
			fontSize: 18,
			fontWeight: '700',
			padding: 20,
			backgroundColor: '#445565'
		},
		popup: {
			padding: 20
		},
		poptitle: {
			fontSize: 24,
			fontWeight: '700',
			marginBottom: 5
		},
		closeBtn: {
			padding: 20,
			fontSize: 20,
			color: '#FFF',
			fontWeight: '700',
			backgroundColor: '#2484C4'
		}
	});
